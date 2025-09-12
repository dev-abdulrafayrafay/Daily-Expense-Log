import { type Expense } from '@/types/expense';

export const exportExpensesToCSV = (expenses: Expense[]) => {
  // Sort expenses by date (oldest first) for CSV export
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // CSV headers
  const headers = ['Date', 'Amount', 'Category', 'Note', 'Created At'];
  
  // Convert expenses to CSV rows
  const csvRows = sortedExpenses.map(expense => [
    expense.date,
    expense.amount.toFixed(2),
    expense.category,
    expense.note || '',
    new Date(expense.createdAt).toISOString()
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};