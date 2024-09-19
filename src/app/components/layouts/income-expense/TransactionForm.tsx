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

  // 初期カテゴリ、状態管理
  const [ categories, setCategories ] = useState<string[]>([
    '食費',
    '光熱費',
    '娯楽',
    '交通費',
    'その他',
  ]);

  // 新しいカテゴリー
  const [ newCategory, setNewCategory ] = useState<string>('');

  // カテゴリー追加処理
  const handleAddCategory = () => {
    if(newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };
// 編集中のカテゴリー
  const [ editingCategory, setEditingCategory ] = useState<string | null>(null);

  // 
  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setNewCategory(category);
  };

  // 
  const handleSaveCategory = () => {
    if(editingCategory) {
      setCategories(categories.map(cat => (cat === editingCategory ? newCategory : cat)));
      setEditingCategory(null);
    }
    setNewCategory('');
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50'>
      <div className='bg-white p-6 z-60'>
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
		    		  <option value="deposit">貯金</option>
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
              {/* <input 
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className='mt-1 p-2 w-full border'
              />
              <button type='button' onClick={() => handleEditCategory(transaction.category)} className='mt-2 bg-yellow-500 text-white px-4 py-2 rounded'>編集</button>
              <button type="button" onClick={handleSaveCategory} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                保存
              </button> */}
          </div>
          {/* <label className='block textgray-700'>新しいカテゴリーを追加</label>
              <input 
              type="text"
              // value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className='mt-1 p-2 w-full border'
              />
              <button type='button' onClick={handleAddCategory} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">追加</button> */}
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
      </div>
      
    </div>
  );
};

export default TransactionForm;
