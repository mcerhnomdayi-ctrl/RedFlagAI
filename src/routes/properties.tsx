import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { properties, getTenantForProperty, formatZAR, payments } from "@/lib/mock-data";
import { ArrowRight, Plus } from "lucide-react";

export const Route = createFileRoute("/properties")({
  head: () => ({ meta: [{ title: "Properties — Landyflow" }] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  return (
    <div className="min-h-screen bg-black text-white page-fade">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-normal">Properties</h1>
            <p className="text-gray-300 mt-1">All units in your portfolio.</p>
          </div>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Add Property</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {properties.map((p) => {
            const tenant = getTenantForProperty(p.id);
            const overdue = payments.find((pay) => pay.propertyId === p.id && pay.status === "missed");
            const dot = p.status === "vacant" ? "amber" : overdue ? "red" : "green";
            return (
              <div key={p.id} className="liquid-glass border border-white/20 rounded-xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-300">{p.type}</div>
                    <div className="text-lg font-medium mt-1">{p.address}</div>
                  </div>
                  <span className={`status-dot status-${dot} mt-2`} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-300">Tenant</div>
                    <div>{tenant?.name ?? <span className="italic text-gray-300">Vacant</span>}</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Monthly Rent</div>
                    <div>{formatZAR(p.monthlyRentCents)}</div>
                  </div>
                </div>
                <Link to="/property/$id" params={{ id: p.id }} className="btn-glass liquid-glass btn-sm mt-5 inline-flex">
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
