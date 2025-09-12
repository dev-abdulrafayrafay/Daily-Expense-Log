import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseItem } from './ExpenseItem';
import { Download, FileText } from 'lucide-react';
import { type Expense } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onExportCSV: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
  onExportCSV
}) => {
  const sortedExpenses = [...expenses].sort((a, b) => {
    // Sort by date (most recent first), then by createdAt
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Expense History ({expenses.length})
          </CardTitle>
          {expenses.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Add your first expense above to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};