import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import {
  getPropertyById,
  getTenantForProperty,
  payments,
  maintenanceJobs,
  formatZAR,
} from "@/lib/mock-data";
import { ArrowLeft, Plus, Upload, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/property/$id")({
  head: () => ({ meta: [{ title: "Property — Landyflow" }] }),
  component: PropertyDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div>Property not found.</div>
    </div>
  ),
});

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "status-green",
    late: "status-amber",
    missed: "status-red",
    pending: "status-amber",
    done: "status-green",
  };
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`status-dot ${map[status] ?? "status-amber"}`} /> {status}
    </span>
  );
}

function PropertyDetail() {
  const { id } = useParams({ from: "/property/$id" });
  const property = getPropertyById(id);
  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="px-6 md:px-12 lg:px-16 py-10">
          <p>Property not found.</p>
        </main>
      </div>
    );
  }
  const tenant = getTenantForProperty(property.id);
  const propPayments = payments.filter((p) => p.propertyId === property.id);
  const propJobs = maintenanceJobs.filter((m) => m.propertyId === property.id);

  return (
    <div className="min-h-screen bg-black text-white page-fade">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-10 max-w-5xl mx-auto space-y-6">
        <Link to="/dashboard" className="btn-glass liquid-glass btn-sm w-max"><ArrowLeft className="w-4 h-4" /> Back</Link>

        {/* Header */}
        <section className="liquid-glass border border-white/20 rounded-xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-md border border-white/20 text-gray-300">
                  {property.type}
                </span>
                <span className={`status-dot status-${property.status === "active" ? "green" : "amber"}`} />
                <span className="text-sm text-gray-300">{property.status}</span>
              </div>
              <h1 className="text-3xl font-normal mt-3">{property.address}</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">Monthly Rent</div>
              <div className="text-2xl font-semibold">{formatZAR(property.monthlyRentCents)}</div>
            </div>
          </div>
        </section>

        {/* Tenant */}
        <section className="liquid-glass border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Tenant</h2>
            <button className="btn-glass liquid-glass btn-sm">Edit Tenant</button>
          </div>
          {tenant ? (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><div className="text-gray-300">Name</div><div>{tenant.name}</div></div>
              <div><div className="text-gray-300">Phone</div><div>{tenant.phone}</div></div>
              <div><div className="text-gray-300">Email</div><div>{tenant.email}</div></div>
              <div><div className="text-gray-300">Lease</div><div>{tenant.leaseStart} → {tenant.leaseEnd}</div></div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm italic">No tenant assigned.</p>
          )}
        </section>

        {/* Rent History */}
        <section className="liquid-glass border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Rent History</h2>
            <button className="btn-primary btn-sm"><Plus className="w-4 h-4" /> Log Payment</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-300">
                <tr className="text-left">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {propPayments.map((p) => (
                  <tr key={p.id} className="table-row-alt">
                    <td className="py-3 px-3">{p.paidDate ?? p.dueDate}</td>
                    <td className="py-3 px-3">{formatZAR(p.amountCents)}</td>
                    <td className="py-3 px-3"><StatusPill status={p.status} /></td>
                    <td className="py-3 px-3 text-gray-300">{p.notes ?? "—"}</td>
                  </tr>
                ))}
                {propPayments.length === 0 && (
                  <tr><td className="py-4 px-3 text-gray-300 italic" colSpan={4}>No payments yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Maintenance */}
        <section className="liquid-glass border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Maintenance Log</h2>
            <button className="btn-glass liquid-glass btn-sm"><Plus className="w-4 h-4" /> Add Job</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-300">
                <tr className="text-left">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Contractor</th>
                  <th className="py-2 px-3">Cost</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {propJobs.map((j) => (
                  <tr key={j.id} className="table-row-alt">
                    <td className="py-3 px-3">{j.scheduledDate}</td>
                    <td className="py-3 px-3">{j.description}</td>
                    <td className="py-3 px-3">{j.contractorName}</td>
                    <td className="py-3 px-3">{formatZAR(j.actualCostCents ?? j.estimatedCostCents)}</td>
                    <td className="py-3 px-3"><StatusPill status={j.status} /></td>
                  </tr>
                ))}
                {propJobs.length === 0 && (
                  <tr><td className="py-4 px-3 text-gray-300 italic" colSpan={5}>No jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Documents */}
        <section className="liquid-glass border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Documents</h2>
          <div className="border border-dashed border-white/20 rounded-xl p-8 text-center text-gray-300 text-sm">
            <Upload className="w-6 h-6 mx-auto mb-2" />
            Drop files here or click to upload (lease, ID, invoices)
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Lease_Agreement_2024.pdf",
              "Tenant_ID_Copy.pdf",
            ].map((f) => (
              <li key={f} className="flex items-center justify-between border border-white/10 rounded-lg px-4 py-2">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {f}</span>
                <button className="text-gray-300 hover:text-white"><Download className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
