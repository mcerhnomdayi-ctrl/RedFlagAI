import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { tenants, properties, payments, getPropertyById } from "@/lib/mock-data";
import { Search, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/tenants")({
  head: () => ({ meta: [{ title: "Tenants — Landyflow" }] }),
  component: TenantsPage,
});

const TABS = ["All", "Active", "Expiring Soon", "Overdue"] as const;
type Tab = typeof TABS[number];

function TenantsPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [q, setQ] = useState("");

  const enriched = useMemo(() => {
    const today = new Date("2026-05-08");
    return tenants.map((t) => {
      const property = getPropertyById(t.propertyId);
      const lastPayment = payments
        .filter((p) => p.tenantId === t.id)
        .sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1))[0];
      const overdue = payments.some((p) => p.tenantId === t.id && p.status === "missed");
      const leaseEnd = new Date(t.leaseEnd);
      const daysToEnd = Math.floor((leaseEnd.getTime() - today.getTime()) / 86400000);
      const expiring = daysToEnd <= 60 && daysToEnd >= 0;
      const status: "green" | "amber" | "red" = overdue ? "red" : expiring ? "amber" : "green";
      return { tenant: t, property, lastPayment, overdue, expiring, status };
    });
  }, []);

  const filtered = enriched.filter((row) => {
    if (q && !row.tenant.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (tab === "Active") return !row.overdue;
    if (tab === "Expiring Soon") return row.expiring;
    if (tab === "Overdue") return row.overdue;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white page-fade">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-normal mb-2">Tenants</h1>
        <p className="text-gray-300 mb-8">Manage everyone renting from you.</p>

        <div className="liquid-glass border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-gray-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tenants..."
            style={{ background: "transparent", border: "none", padding: "8px 0" }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-white text-black" : "liquid-glass border border-white/20 text-white hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((row) => (
            <div key={row.tenant.id} className="liquid-glass border border-white/20 rounded-xl px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`status-dot status-${row.status}`} />
                <div>
                  <div className="font-medium">{row.tenant.name}</div>
                  <div className="text-xs text-gray-300">{row.tenant.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-300 truncate max-w-xs">{row.property?.address}</div>
              <div className="text-sm">
                <div className="text-gray-300 text-xs">Lease End</div>
                <div>{row.tenant.leaseEnd}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-300 text-xs">Last Payment</div>
                <div>{row.lastPayment?.paidDate ?? "—"}</div>
              </div>
              <button className="btn-glass liquid-glass btn-sm">View <ArrowRight className="w-4 h-4" /></button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-300 italic text-sm">No tenants match these filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}
