// pages/index.js
"use client";
import { supabase } from '../../../lib/supabaseClient';
import { useEffect, useState } from 'react';
import type { Transaction } from '@/app/components/layouts/income-expense/transactions'
import Calendar from '../../calendar/calendar';




export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: '支出',
    category: '',
    note: '',
    date: '',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value,
    });
  };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const { amount, type, category, note, date } = newTransaction;
	
		const { data, error } = await supabase
			.from('transactions')
			.insert([{ amount: parseFloat(amount), type, category, note, date }])
			.select('*'); // 新しく追加されたデータを返すように指定
	
		if (error) {
			console.error('Error adding transaction:', error);
		} else if (data && data.length > 0) {
			// 新しく追加されたデータを先頭に追加してステートを更新
			setTransactions([data[0], ...transactions]);
	
			// フォームをクリア
			setNewTransaction({
				amount: '',
				type: 'income',
				category: '',
				note: '',
				date: '',
			});
		}
	};
	
	
	

  return (
		<main>
			<div className="grid grid-cols-10">
        <div className="col-span-8">
					{/* <Calendar /> */}
        </div>
      </div>
			<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {/* フォームの追加 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleChange}
            className="mt-1 p-2 w-full border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">収入/支出</label>
          <select
            name="type"
            value={newTransaction.type}
            onChange={handleChange}
            className="mt-1 p-2 w-full border"
            required
          >
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={newTransaction.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Note</label>
          <input
            type="text"
            name="note"
            value={newTransaction.note}
            onChange={handleChange}
            className="mt-1 p-2 w-full border"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={newTransaction.date}
            onChange={handleChange}
            className="mt-1 p-2 w-full border"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Transaction
        </button>
      </form>

      {/* 取引データの表示 */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {/* <th className="border px-4 py-2">ID</th> */}
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Note</th>
            {/* <th className="border px-4 py-2">Date</th> */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              {/* <td className="border px-4 py-2">{transaction.id}</td> */}
              <td className="border px-4 py-2">{transaction.amount}</td>
              <td className="border px-4 py-2">{transaction.type}</td>
              <td className="border px-4 py-2">{transaction.category}</td>
              <td className="border px-4 py-2">{transaction.note}</td>
              {/* <td className="border px-4 py-2">{transaction.date}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
		</main>

  );
}
