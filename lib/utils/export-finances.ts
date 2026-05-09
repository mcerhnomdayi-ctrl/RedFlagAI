/**
 * Formats a number as ZAR currency (R 0.00)
 */
const formatZAR = (cents: number) => {
  return (cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });
};

/**
 * Exports payments and expenses for the selected year as a CSV string.
 */
export const exportFinancesToCSV = (
  payments: any[],
  expenses: any[],
  year: number
) => {
  const headers = ['Type', 'Date', 'Description/Tenant', 'Amount (ZAR)', 'Status/Category'];
  const rows: string[][] = [];

  // Filter and format payments
  payments
    .filter((p) => new Date(p.due_date).getFullYear() === year)
    .forEach((p) => {
      rows.push([
        'Payment',
        p.paid_date || p.due_date,
        p.tenants?.name || 'Unknown Tenant',
        formatZAR(p.amount_cents),
        p.status
      ]);
    });

  // Filter and format expenses
  expenses
    .filter((e) => new Date(e.date).getFullYear() === year)
    .forEach((e) => {
      rows.push([
        'Expense',
        e.date,
        e.description || e.category,
        formatZAR(e.amount_cents),
        e.category
      ]);
    });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};
