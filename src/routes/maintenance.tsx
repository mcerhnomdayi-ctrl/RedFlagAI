import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { maintenanceJobs, getPropertyById, formatZAR } from "@/lib/mock-data";
import { Plus, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — Landyflow" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const [month] = useState(new Date("2026-05-01"));
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const today = new Date("2026-05-08");

  const jobsByDay = new Map<number, number>();
  maintenanceJobs.forEach((j) => {
    const d = new Date(j.scheduledDate);
    if (d.getFullYear() === year && d.getMonth() === m) {
      jobsByDay.set(d.getDate(), (jobsByDay.get(d.getDate()) ?? 0) + 1);
    }
  });

  const monthLabel = month.toLocaleString("en-ZA", { month: "long", year: "numeric" });

  const sortedJobs = [...maintenanceJobs].sort((a, b) =>
    a.scheduledDate < b.scheduledDate ? -1 : 1
  );

  return (
    <div className="min-h-screen bg-black text-white page-fade">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-10 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-normal">Maintenance</h1>
            <p className="text-gray-300 mt-1">Scheduled jobs across your portfolio.</p>
          </div>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Add Maintenance Job</button>
        </div>

        <div className="liquid-glass border border-white/20 rounded-xl p-6 mb-8">
          <div className="text-lg font-medium mb-4">{monthLabel}</div>
          <div className="grid grid-cols-7 gap-2 text-xs text-gray-300 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => <div key={"e" + i} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = today.getFullYear() === year && today.getMonth() === m && today.getDate() === day;
              const count = jobsByDay.get(day);
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg p-2 text-sm flex flex-col justify-between border ${
                    isToday ? "liquid-glass border-white/40" : "border-white/10"
                  }`}
                >
                  <span>{day}</span>
                  {count && (
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                        <span key={j} className="status-dot status-amber" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <h2 className="text-2xl font-normal mb-4">All Jobs</h2>
        <div className="space-y-3">
          {sortedJobs.map((j) => {
            const prop = getPropertyById(j.propertyId);
            return (
              <div key={j.id} className="liquid-glass border border-white/20 rounded-xl px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium">{j.description}</div>
                  <div className="text-sm text-gray-300 truncate">{prop?.address}</div>
                  <div className="text-xs text-gray-300 mt-1 flex items-center gap-2">
                    <span>{j.contractorName}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {j.contractorPhone}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-300 text-xs">Scheduled</div>
                  <div>{j.scheduledDate}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-300 text-xs">Est. Cost</div>
                  <div>{formatZAR(j.estimatedCostCents)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-md font-medium ${
                      j.status === "pending"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {j.status === "pending" ? "Pending" : "Done"}
                  </span>
                  {j.status === "pending" && (
                    <button className="btn-primary btn-sm">Mark Done</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
