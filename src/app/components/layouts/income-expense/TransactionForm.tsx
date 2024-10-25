import { useEffect, useState } from 'react';
import { Transaction } from './transactions';
import { Calendar } from 'primereact/calendar';
// グローバルなスタイルファイルや_app.tsxなどでインポート
import 'primereact/resources/themes/saga-blue/theme.css'; // 例: Saga Blueテーマ
import 'primereact/resources/primereact.min.css'; // PrimeReactの基本スタイル
import 'primeicons/primeicons.css'; // PrimeIcons

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

  // 初期カテゴリ、状態管理　新規でカテゴリを追加したときにDBに登録するように修正する
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-end'>
      <div className='bg-neutral-100 p-6 z-60 w-2/5'>
      <p className='text-center'>入力</p>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">金額</label>
            <input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">収入/支出</label>
            <select
              name="type"
              value={transaction.type}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="expense">支出</option>
		    		  <option value="income">収入</option>
		    		  <option value="deposit">貯金</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">分類</label>
            <select
              name="category"
              value={transaction.category}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded-md'
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
            <label className="block text-gray-700">メモ</label>
            <input
              type="text"
              name="note"
              value={transaction.note}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">日付</label>
            <Calendar
              value={new Date(transaction.date)}
              onChange={(e) => handleChange({ target: { name: 'date', value: e.value ? e.value.toLocaleDateString('en-CA') : '' } } as React.ChangeEvent<HTMLInputElement>)}
              className="mt-1 w-full rounded-md border"
              inputStyle={{ padding: '0.5rem', width: '100%', borderRight: '1px solid #d3d3d3'}}
              showIcon
              required
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-muted-blue border-2 text-white px-4 py-2 rounded-full">
              {editingTransaction ? '更新' : '追加'}
            </button>
            <button type='button' onClick={onCancel} className="bg-muted-gray border-2 text-white px-4 py-2 rounded-full">
              キャンセル
            </button>
          </div>
        </form>
        <div className='border-t-4 pt-4 mt-5'>
          <p className='pb-1'>新規カテゴリーを追加</p>
          <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className='mt-1 p-2 w-full border'
          />
          <div className='flex gap-3 mt-3'>
            <button type="button" onClick={handleSaveCategory} className="mt-2 bg-muted-green border-2 text-white px-4 py-2 rounded-full">
              保存
            </button>
            <button type='button' onClick={() => handleEditCategory(transaction.category)} className='mt-2 bg-muted-yellow border-2 text-white px-4 py-2 rounded-full'>編集</button>
            <button type='button' onClick={handleAddCategory} className="mt-2 bg-muted-blue border-2 text-white px-4 py-2 rounded-full">追加</button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default TransactionForm;
