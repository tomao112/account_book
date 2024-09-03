import { useEffect, useState } from 'react';

interface TransactionFormProps {
	selectedDate: Date;
  onSubmit: (transaction: {
    amount: string;
    type: string;
    category: string;
    note: string;
    date: string;
  }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ selectedDate, onSubmit }) => {
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'expense',
    category: '',
    note: '',
    date: selectedDate.toLocaleDateString('en-CA'),
  });

	// 日付の変更を監視
	useEffect(() => {
		setNewTransaction((prev) => ({
			...prev,
			date: selectedDate.toLocaleDateString('en-CA'),
		}));
	}, [selectedDate]);

	// フォーム入力値を変更したときに実行される
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value,
    });
  };

	// フォーム送信時に実行
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newTransaction);
    setNewTransaction({
      amount: '',
      type: 'expense',
      category: '',
      note: '',
      date: selectedDate.toLocaleDateString('en-CA'),
    });
  };

  return (
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
          <option value="expense">支出</option>
					<option value="income">収入</option>
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
  );
};

export default TransactionForm;
