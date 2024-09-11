import { useEffect, useState } from 'react';
import { Transaction } from './transactions';

interface TransactionFormProps {
	selectedDate: Date | null;
  editingTransaction: Transaction | null;
  onSubmit: (transaction: Transaction | Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ selectedDate, editingTransaction, onSubmit, onCancel }) => {
  const [transaction, setTransaction] = useState({
    amount: '',
    type: 'expense',
    category: '',
    note: '',
    date: selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'),
  });

	// 日付の変更を監視
	useEffect(() => {
    if(editingTransaction) {
      setTransaction({
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category,
        note: editingTransaction.note,
        date: editingTransaction.date,
      });
    } else if(selectedDate) {
      setTransaction((prev) => ({
        ...prev,
        date: selectedDate.toLocaleDateString('en-CA'),
      }));
    }
	}, [editingTransaction, selectedDate]);

	// フォーム入力値を変更したときに実行される
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

	// フォーム送信時に実行
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedTransaction = {
      ...transaction,
      amount: parseFloat(transaction.amount),
    };
    if(editingTransaction) {
      onSubmit({ ...submittedTransaction, id: editingTransaction.id});
    } else {
      onSubmit(submittedTransaction);
    }
    setTransaction({
      amount: '',
      type: 'expense',
      category: '',
      note: '',
      date: new Date().toLocaleDateString('en-CA'),
    })
  };

  const categories = [
    '食費',
    '光熱費',
    '娯楽',
    '交通費',
    'その他',
  ];

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label className="block text-gray-700">Amount</label>
        <input
          type="number"
          name="amount"
          value={transaction.amount}
          onChange={handleChange}
          className="mt-1 p-2 w-full border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">収入/支出</label>
        <select
          name="type"
          value={transaction.type}
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
        <select
          name="category"
          value={transaction.category}
          onChange={handleChange}
          className='mt-1 p-2 w-full border'
          required
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Note</label>
        <input
          type="text"
          name="note"
          value={transaction.note}
          onChange={handleChange}
          className="mt-1 p-2 w-full border"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={transaction.date}
          onChange={handleChange}
          className="mt-1 p-2 w-full border"
          required
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingTransaction ? '更新' : '追加'}
        </button>
        <button type='button' onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
