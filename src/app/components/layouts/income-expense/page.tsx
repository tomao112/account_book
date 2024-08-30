'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { Transaction } from './transactions';
import Calendar from '@/app/components/calendar/calendar';
import TransactionList from '@/app/components/layouts/income-expense/TransactionList';
import TransactionForm from '@/app/components/layouts/income-expense/TransactionForm';
import TotalAmount from './TotalAmount';

export default function Home() {
  // transactionsデータとカレンダーで選択された日付を管理する
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      // transactionsテーブルのdateカラムを降順で取得
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        // console.log('Fetched transactions:', data);
        setTransactions(data as Transaction[]);
      }
    };

    fetchTransactions();

    // supabaseの変更をリアルタイムで監視する
    const subscription = supabase
    .channel('public:transactions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
      console.log('Change received!', payload);

      const newTransaction = payload.new as Transaction;
      const oldTransaction = payload.old as Transaction;

      // prevTransactions = 現在のtransactionsの状態
      // newTransactions, ...prevTransactions = 新しいデータをtransactionsの先頭に追加
      // t = 現在のtransactions
      // 条件が一致すればnewTransactionに置き換え、一致しなければそのまま
      switch (payload.eventType) {
        case 'INSERT':
          setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
          break;
        case 'UPDATE':
          setTransactions(prevTransactions =>
            prevTransactions.map(t => t.id === newTransaction.id ? newTransaction : t)
          );
          break;
        case 'DELETE':
          setTransactions(prevTransactions =>
            prevTransactions.filter(t => t.id !== oldTransaction.id)
          );
          break;
      }
    })
    .subscribe();

  return () => {
    // コンポーネントがアンマウントされるときにsupabaseのサブスクリプションを解除してリソースを開放する
    // メモリリークや無駄なリソースを避ける
    supabase.removeChannel(subscription);
  };
  }, []);

  const handleAddTransaction = async (newTransaction: {
    amount: string;
    type: string;
    category: string;
    note: string;
    date: string;
  }) => {
    console.log('handleAddTransaction called with:', newTransaction);
    const { amount, type, category, note, date } = newTransaction;

    const { data, error} = await supabase
      .from('transactions')
      .insert([{ amount: parseFloat(amount), type, category, note, date }])
      .select('*');

      if(error) {
        console.error('Error adding transaction:', error);
      } else if(data && data.length > 0) {
        setTransactions((prevTransactions) => [data[0], ...prevTransactions]);
        console.log('New transaction added:', data[0]);
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
      console.log('Transaction updated:', updatedTransaction);
      setTransactions((prevTransactions) => prevTransactions.map((t) => t.id === updatedTransaction.id ? updatedTransaction : t));
    }
  };
  
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
    } else {
      console.log('Transaction deleted:', id);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => t.id !== id)
      );
    }
  };


  return (
    <main>
      <div>
        <Calendar />
        <div>
          <TotalAmount selectedMonth={new Date()} transactions={transactions} />
        </div>
        <div className="col-span-8">
          <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
      <div className="container mx-auto p-4">
        {selectedDate && (
          <TransactionForm
            selectedDate={selectedDate}
            onSubmit={handleAddTransaction}
          />
        )}
      </div>
    </main>
  );
}
