import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { FadeIn } from "@/components/FadeIn";
import { properties, payments, maintenanceJobs, tenants, formatZAR, getTenantForProperty } from "@/lib/mock-data";
import { Plus, Receipt, Wrench, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Landyflow" }] }),
  component: Dashboard,
});

function Dashboard() {
  const totalUnits = properties.length;
  const collectedThisMonth = payments
    .filter((p) => p.status === "paid" && p.dueDate.startsWith("2026-05"))
    .reduce((s, p) => s + p.amountCents, 0);
  const overdue = payments.filter((p) => p.status === "missed").length;
  const upcomingMaint = maintenanceJobs.filter((m) => m.status === "pending").length;

  const summary = [
    { label: "Total Units", value: String(totalUnits), dot: "green" },
    { label: "Rent Collected (May)", value: formatZAR(collectedThisMonth), dot: "green" },
    { label: "Overdue Payments", value: String(overdue), dot: overdue > 0 ? "red" : "green" },
    { label: "Upcoming Maintenance", value: String(upcomingMaint), dot: upcomingMaint > 0 ? "amber" : "green" },
  ];

  return (
    <div className="min-h-screen bg-black text-white page-fade">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-10 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-normal">Dashboard</h1>
              <p className="text-gray-300 mt-1">Welcome back. Here's how your portfolio is doing.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-glass liquid-glass btn-sm"><Plus className="w-4 h-4" /> Add Property</button>
              <button className="btn-glass liquid-glass btn-sm"><Receipt className="w-4 h-4" /> Log Payment</button>
              <button className="btn-glass liquid-glass btn-sm"><Wrench className="w-4 h-4" /> Schedule Maintenance</button>
            </div>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {summary.map((s, i) => (
            <FadeIn key={s.label} delay={100 + i * 100}>
              <div className="liquid-glass border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{s.label}</span>
                  <span className={`status-dot status-${s.dot}`} />
                </div>
                <div className="text-2xl font-semibold mt-3">{s.value}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={500}>
          <h2 className="text-2xl font-normal mb-4">Properties</h2>
        </FadeIn>
        <div className="space-y-3">
          {properties.map((p, i) => {
            const tenant = getTenantForProperty(p.id);
            const overduePay = payments.find((pay) => pay.propertyId === p.id && pay.status === "missed");
            const dot = p.status === "vacant" ? "amber" : overduePay ? "red" : "green";
            return (
              <FadeIn key={p.id} delay={600 + i * 100}>
                <div className="liquid-glass border border-white/20 rounded-xl px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`status-dot status-${dot}`} />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.address}</div>
                      <div className="text-sm text-gray-300">
                        {tenant ? tenant.name : <span className="italic">Vacant</span>} · {p.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Monthly</div>
                      <div className="font-medium">{formatZAR(p.monthlyRentCents)}</div>
                    </div>
                    <Link to="/property/$id" params={{ id: p.id }} className="btn-glass liquid-glass btn-sm">
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-10 text-sm text-gray-300">
          {tenants.length} active tenants across {properties.filter((p) => p.status === "active").length} occupied units.
        </div>
      </main>
    </div>
  );
}
