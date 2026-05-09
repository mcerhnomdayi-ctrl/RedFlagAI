// Mock data for Landyflow
export type Property = {
  id: string;
  address: string;
  type: "flat" | "house" | "room";
  monthlyRentCents: number;
  tenantId: string | null;
  status: "active" | "vacant";
};

export type Tenant = {
  id: string;
  name: string;
  phone: string;
  email: string;
  leaseStart: string;
  leaseEnd: string;
  propertyId: string;
};

export type Payment = {
  id: string;
  propertyId: string;
  tenantId: string;
  amountCents: number;
  dueDate: string;
  paidDate: string | null;
  status: "paid" | "late" | "missed";
  notes?: string;
};

export type MaintenanceJob = {
  id: string;
  propertyId: string;
  description: string;
  contractorName: string;
  contractorPhone: string;
  scheduledDate: string;
  estimatedCostCents: number;
  actualCostCents?: number;
  status: "pending" | "done";
};

export type Expense = {
  id: string;
  propertyId: string;
  date: string;
  category: "Maintenance" | "Rates & Taxes" | "Levy" | "Insurance" | "Other";
  description: string;
  amountCents: number;
};

export const properties: Property[] = [
  { id: "p1", address: "12 Bree Street, Apt 4B, Cape Town", type: "flat", monthlyRentCents: 1250000, tenantId: "t1", status: "active" },
  { id: "p2", address: "47 Oak Avenue, Sandton", type: "house", monthlyRentCents: 2200000, tenantId: "t2", status: "active" },
  { id: "p3", address: "9 Loop Street, Studio 2, Cape Town", type: "room", monthlyRentCents: 750000, tenantId: "t3", status: "active" },
  { id: "p4", address: "88 Rivonia Road, Unit 12, Johannesburg", type: "flat", monthlyRentCents: 1500000, tenantId: null, status: "vacant" },
];

export const tenants: Tenant[] = [
  { id: "t1", name: "Thandi Mokoena", phone: "+27 82 555 0101", email: "thandi@example.com", leaseStart: "2024-03-01", leaseEnd: "2026-02-28", propertyId: "p1" },
  { id: "t2", name: "James van der Merwe", phone: "+27 83 555 0202", email: "james@example.com", leaseStart: "2025-01-15", leaseEnd: "2026-06-30", propertyId: "p2" },
  { id: "t3", name: "Sipho Dlamini", phone: "+27 84 555 0303", email: "sipho@example.com", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", propertyId: "p3" },
];

export const payments: Payment[] = [
  { id: "pay1", propertyId: "p1", tenantId: "t1", amountCents: 1250000, dueDate: "2026-05-01", paidDate: "2026-05-01", status: "paid" },
  { id: "pay2", propertyId: "p2", tenantId: "t2", amountCents: 2200000, dueDate: "2026-05-01", paidDate: "2026-05-03", status: "late", notes: "Paid 2 days late" },
  { id: "pay3", propertyId: "p3", tenantId: "t3", amountCents: 750000, dueDate: "2026-05-01", paidDate: null, status: "missed" },
  { id: "pay4", propertyId: "p1", tenantId: "t1", amountCents: 1250000, dueDate: "2026-04-01", paidDate: "2026-04-01", status: "paid" },
  { id: "pay5", propertyId: "p2", tenantId: "t2", amountCents: 2200000, dueDate: "2026-04-01", paidDate: "2026-04-01", status: "paid" },
];

export const maintenanceJobs: MaintenanceJob[] = [
  { id: "m1", propertyId: "p1", description: "Geyser leak repair", contractorName: "QuickFix Plumbing", contractorPhone: "+27 21 555 1010", scheduledDate: "2026-05-12", estimatedCostCents: 350000, status: "pending" },
  { id: "m2", propertyId: "p2", description: "Garden service - quarterly", contractorName: "Green Thumb", contractorPhone: "+27 11 555 2020", scheduledDate: "2026-05-15", estimatedCostCents: 120000, status: "pending" },
  { id: "m3", propertyId: "p3", description: "Repaint bedroom", contractorName: "ColourPro", contractorPhone: "+27 21 555 3030", scheduledDate: "2026-04-20", estimatedCostCents: 280000, actualCostCents: 295000, status: "done" },
  { id: "m4", propertyId: "p1", description: "Aircon service", contractorName: "CoolAir Tech", contractorPhone: "+27 21 555 4040", scheduledDate: "2026-05-22", estimatedCostCents: 95000, status: "pending" },
];

export const expenses: Expense[] = [
  { id: "e1", propertyId: "p1", date: "2026-04-20", category: "Maintenance", description: "Repaint bedroom", amountCents: 295000 },
  { id: "e2", propertyId: "p1", date: "2026-04-05", category: "Rates & Taxes", description: "Municipal rates", amountCents: 180000 },
  { id: "e3", propertyId: "p2", date: "2026-04-10", category: "Levy", description: "Body corp levy", amountCents: 220000 },
  { id: "e4", propertyId: "p2", date: "2026-04-15", category: "Insurance", description: "Building insurance", amountCents: 85000 },
  { id: "e5", propertyId: "p3", date: "2026-04-18", category: "Maintenance", description: "Plumbing fix", amountCents: 65000 },
];

export function formatZAR(cents: number) {
  return "R" + (cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getTenantForProperty(propertyId: string): Tenant | undefined {
  return tenants.find((t) => t.propertyId === propertyId);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}
