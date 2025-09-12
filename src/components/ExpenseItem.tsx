import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { type Expense, EXPENSE_CATEGORIES } from '@/types/expense';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());
  const [editCategory, setEditCategory] = useState(expense.category);
  const [editNote, setEditNote] = useState(expense.note || '');
  const [editDate, setEditDate] = useState(expense.date);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSave = () => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0 || !editCategory) return;

    onEdit({
      ...expense,
      amount,
      category: editCategory,
      note: editNote.trim() || undefined,
      date: editDate
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditNote(expense.note || '');
    setEditDate(expense.date);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Amount"
              />
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
            
            <Select value={editCategory} onValueChange={setEditCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
            />

            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-destructive">
                {formatCurrency(expense.amount)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {expense.category}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground mb-1">
              {formatDate(expense.date)}
            </div>
            
            {expense.note && (
              <p className="text-sm text-foreground mt-2">
                {expense.note}
              </p>
            )}
          </div>
          
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(expense.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};