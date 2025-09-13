import React, { useCallback, useEffect } from 'react';
import { ExpenseForm } from '@/components/ExpenseForm';
import { TotalsCard } from '@/components/TotalsCard';
import { ExpenseList } from '@/components/ExpenseList';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportExpensesToCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { type Expense } from '@/types/expense';

const Index = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('dailyExpenses', []);
  const { toast } = useToast();
  // Daily reset using a cookie to track 24h expiry
  useEffect(() => {
    const cookieName = 'dailyExpensesExpiry';
    const getCookie = (name: string) =>
      document.cookie.split('; ').find((row) => row.startsWith(name + '='))?.split('=')[1];
    const setCookie = (name: string, value: string, expires: Date) => {
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    };
    const now = new Date();
    const expiryStr = getCookie(cookieName);
    if (!expiryStr) {
      const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      setCookie(cookieName, String(expires.getTime()), expires);
    } else {
      const expiry = new Date(Number(expiryStr));
      if (now > expiry) {
        setExpenses([]);
        const newExp = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        setCookie(cookieName, String(newExp.getTime()), newExp);
      }
    }
  }, [setExpenses]);
  const handleAddExpense = useCallback((newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    setExpenses(prev => [...prev, expense]);
    toast({
      title: "Expense Added",
      description: `Added $${expense.amount.toFixed(2)} for ${expense.category}`,
    });
  }, [setExpenses, toast]);

  const handleEditExpense = useCallback((editedExpense: Expense) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === editedExpense.id ? editedExpense : expense
      )
    );
    toast({
      title: "Expense Updated",
      description: `Updated expense for $${editedExpense.amount.toFixed(2)}`,
    });
  }, [setExpenses, toast]);

  const handleDeleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Expense Deleted",
      description: "Expense has been removed from your log",
      variant: "destructive"
    });
  }, [setExpenses, toast]);

  const handleExportCSV = useCallback(() => {
    exportExpensesToCSV(expenses);
    toast({
      title: "Export Complete",
      description: `Exported ${expenses.length} expenses to CSV`,
    });
  }, [expenses, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Daily Expense Log
          </h1>
          <p className="text-muted-foreground">
            Track your daily expenses and stay on budget
          </p>
        </header>

        <div className="space-y-6">
          {/* Quick Add Form */}
          <ExpenseForm onAddExpense={handleAddExpense} />
          
          {/* Totals Cards */}
          <TotalsCard expenses={expenses} />
          
          {/* Expense List */}
          <ExpenseList 
            expenses={expenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onExportCSV={handleExportCSV}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
