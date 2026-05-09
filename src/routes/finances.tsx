import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { properties, payments, expenses, formatZAR } from "@/lib/mock-data";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/finances")({
  head: () => ({ meta: [{ title: "Finances — Landyflow" }] }),
  component: FinancesPage,
});

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function FinancesPage() {
  // Build monthly chart data for 2026
  const chartData = months.map((label, idx) => {
    const monthKey = `2026-${String(idx + 1).padStart(2, "0")}`;
    const collected = payments
      .filter((p) => p.dueDate.startsWith(monthKey) && p.status === "paid")
      .reduce((s, p) => s + p.amountCents, 0) / 100;
    const expected = properties.reduce((s, p) => s + p.monthlyRentCents, 0) / 100;
    return { month: label, collected, expected };
  });

  const netByProperty = properties.map((p) => {
    const income = payments
      .filter((pay) => pay.propertyId === p.id && pay.status === "paid")
      .reduce((s, pay) => s + pay.amountCents, 0);
    const exp = expenses
      .filter((e) => e.propertyId === p.id)
      .reduce((s, e) => s + e.amountCents, 0);
    return { property: p, income, expenses: exp, net: income - exp };
  });

  return (
    <div className="min-h-screen bg-black text-white page-fade">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-2 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-normal">Finances</h1>
            <p className="text-gray-300 mt-1">Income vs expenses across your portfolio.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="!w-auto" defaultValue="2026">
              <option>2026</option>
              <option>2025</option>
            </select>
            <button className="btn-glass liquid-glass btn-sm"><Download className="w-4 h-4" /> Export CSV</button>
          </div>
        </div>
        <div className="text-xs text-gray-300 mb-8">Tax year runs March – February</div>

        <section className="liquid-glass border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Monthly Income vs Expected Rent</h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#D1D5DB" fontSize={12} />
                <YAxis stroke="#D1D5DB" fontSize={12} tickFormatter={(v) => "R" + v.toLocaleString("en-ZA")} />
                <Tooltip
                  contentStyle={{ background: "#000", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8 }}
                  formatter={(v) => "R" + Number(v).toLocaleString("en-ZA")}
                />
                <Bar dataKey="expected" fill="rgba(255,255,255,0.25)" radius={[4,4,0,0]} />
                <Bar dataKey="collected" fill="#ffffff" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="liquid-glass border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Expense Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-300">
                <tr className="text-left">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="table-row-alt">
                    <td className="py-3 px-3">{e.date}</td>
                    <td className="py-3 px-3">{e.category}</td>
                    <td className="py-3 px-3 text-gray-300">{e.description}</td>
                    <td className="py-3 px-3 text-right">{formatZAR(e.amountCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="liquid-glass border border-white/20 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Net Profit per Property</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-300">
                <tr className="text-left">
                  <th className="py-2 px-3">Property</th>
                  <th className="py-2 px-3 text-right">Income</th>
                  <th className="py-2 px-3 text-right">Expenses</th>
                  <th className="py-2 px-3 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {netByProperty.map((row) => (
                  <tr key={row.property.id} className="table-row-alt">
                    <td className="py-3 px-3">{row.property.address}</td>
                    <td className="py-3 px-3 text-right">{formatZAR(row.income)}</td>
                    <td className="py-3 px-3 text-right">{formatZAR(row.expenses)}</td>
                    <td className={`py-3 px-3 text-right font-medium ${row.net >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatZAR(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
