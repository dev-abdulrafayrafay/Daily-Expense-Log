export interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO date string
  createdAt: string; // ISO datetime string
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Personal Care',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];