'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { Transaction } from './transactions';
import Calendar from '@/app/components/calendar/calendar';
import TransactionList from '@/app/components/layouts/income-expense/TransactionList';
import TransactionForm from '@/app/components/layouts/income-expense/TransactionForm';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data as Transaction[]);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async (newTransaction: {
    amount: string;
    type: string;
    category: string;
    note: string;
    date: string;
  }) => {
    const { amount, type, category, note, date } = newTransaction;

    const { data, error} = await supabase
      .from('transactions')
      .insert([{ amount: parseFloat(amount), type, category, note, date }])
      .select('*');

      if(error) {
        console.error('Error adding transaction:', error);
      } else if(data && data.length > 0) {
        setTransactions([data[0], ...transactions]);

        setSelectedDate(null);
      }
  }

  const handleEdit = async (updatedTransaction: Transaction) => {
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: updatedTransaction.amount,
        type: updatedTransaction.type,
        category: updatedTransaction.category,
        note: updatedTransaction.note,
      })
      .eq('id', updatedTransaction.id);

    if (error) {
      console.error('Error updating transaction:', error);
    } else {
      setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  }

  return (
    <main>
      <div>
        <Calendar />
        <div className="col-span-8">
          <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
      <div className="container mx-auto p-4">
        {selectedDate && (
          <TransactionForm
            selectedDate={selectedDate}
            onSubmit={handleAddTransaction
              // setSelectedDate(null);
            }
          />
        )}
      </div>
    </main>
  );
}
