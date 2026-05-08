import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 1. Find unpaid payments where due_date has passed and status is not already 'late' or 'missed'
    // The trigger handles status, but we want to proactively mark unpaid overdue as 'late'
    // and notify the landlord.
    const { data: latePayments, error: fetchError } = await supabase
      .from("payments")
      .select(`
        id,
        amount_cents,
        due_date,
        property_id,
        properties (
          address,
          user_id
        ),
        tenant_id,
        tenants (
          name
        )
      `)
      .is("paid_date", null)
      .lt("due_date", new Date().toISOString().split('T')[0])
      .neq("status", "late");

    if (fetchError) throw fetchError;

    const results = [];

    for (const payment of latePayments || []) {
      // 2. Mark as 'late' (if trigger didn't already or to be explicit)
      await supabase
        .from("payments")
        .update({ status: "late" })
        .eq("id", payment.id);

      // 3. Get landlord email (using auth.users is tricky from edge function without extra steps,
      // but we can assume we might have it or need to fetch it. For now, we'll try to find
      // the landlord's email from a profile table if it existed, but since it doesn't
      // in the schema provided, we'll use a placeholder or assume the tenant's email
      // is for notification? No, the requirement says "send a Resend email to the landlord".)

      // Since we don't have a 'profiles' table with emails, we'll fetch from auth.admin
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(payment.properties.user_id);

      if (!userError && userData?.user?.email) {
        const landlordEmail = userData.user.email;
        const amountR = (payment.amount_cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });

        // 4. Send email via Resend
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "LandyFlow <notifications@landyflow.com>",
            to: [landlordEmail],
            subject: `Late Payment Alert: ${payment.properties.address}`,
            html: `
              <p>Hi Landlord,</p>
              <p>This is an automated alert that a payment for <strong>${payment.properties.address}</strong> is now late.</p>
              <ul>
                <li><strong>Tenant:</strong> ${payment.tenants.name}</li>
                <li><strong>Amount:</strong> ${amountR}</li>
                <li><strong>Due Date:</strong> ${payment.due_date}</li>
              </ul>
              <p>Please follow up with your tenant.</p>
              <p>Best,<br/>LandyFlow HQ</p>
            `,
          }),
        });

        const emailResult = await res.json();
        results.push({ paymentId: payment.id, emailResult });
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results.length, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
