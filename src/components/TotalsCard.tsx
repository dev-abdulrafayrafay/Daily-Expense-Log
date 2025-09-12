import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, CalendarDays } from 'lucide-react';
import { type Expense } from '@/types/expense';

interface TotalsCardProps {
  expenses: Expense[];
}

export const TotalsCard: React.FC<TotalsCardProps> = ({ expenses }) => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const todayTotal = expenses
    .filter(expense => expense.date === today)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthTotal = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Total</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(todayTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            {expenses.filter(e => e.date === today).length} expense(s) today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Total</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(monthTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            {expenses.filter(expense => {
              const expenseDate = new Date(expense.date);
              return expenseDate.getMonth() === currentMonth && 
                     expenseDate.getFullYear() === currentYear;
            }).length} expense(s) this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};