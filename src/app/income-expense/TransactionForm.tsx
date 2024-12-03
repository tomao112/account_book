// account_book/src/app/components/layouts/income-expense/TransactionForm.tsx

import React, { useState, useEffect } from "react";
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { Transaction } from './transactions';
import { supabase } from '@/app/lib/supabaseClient'; // Supabaseクライアントをインポート
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
        if (editingTransaction) {
            setTransaction({
                amount: editingTransaction.amount.toString(),
                type: editingTransaction.type,
                category: editingTransaction.category,
                note: editingTransaction.note,
                date: editingTransaction.date,
            });
        } else if (selectedDate) {
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

    // カテゴリ配列
    const categories = [
      '食費',
      '光熱費',
      '娯楽',
      '交通費',
      'レジャー',
      'スーパー/コンビニ',
      'ファッション/美容',
      '日用品',
      '住居/通信',
      '健康/教育',
      'その他',
    ];

// TransactionFormコンポーネントの定義はそのまま

    // 新しいカテゴリー
    const [newCategory, setNewCategory] = useState<string>('');

    // カテゴリー追加処理
    // const handleAddCategory = async () => {
    //     if (newCategory && !categories.includes(newCategory)) {
    //         // カテゴリーをローカルに追加
    //         setCategories([...categories, newCategory]);

    //         // カテゴリーをデータベースに登録
    //         const { data, error } = await supabase.from('categories').insert([{ name: newCategory }]);
    //         if (error) {
    //             console.error('Error adding category:', error.message);
    //         } else {
    //             console.log('Category added:', data);
    //         }

    //         setNewCategory('');
    //     }
    // };

    // 編集中のカテゴリ
    const [editingCategory, setEditingCategory] = useState<string | null>(null);

    //カテゴリ編集
    // const handleEditCategory = (category: string) => {
    //     setEditingCategory(category);
    //     setNewCategory(category);
    // };

    //カテゴリ保存
    // const handleSaveCategory = () => {
    //     if (editingCategory) {
    //         setCategories(categories.map(cat => (cat === editingCategory ? newCategory : cat)));
    //         setEditingCategory(null);
    //     }
    //     setNewCategory('');
    // };

    // SelectButton用のオプション
    const typeOptions = [
      { label: '支出', value: 'expense', className: 'expense-option' },
      { label: '収入', value: 'income', className: 'income-option' },
      { label: '貯金', value: 'deposit', className: 'deposit-option' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      // 選択必須のチェック、フォーム送信時に実行
      if (!transaction.type) {
          alert('収入/支出のタイプを選択してください。');
          return;
      }
  
      const submittedTransaction = {
          ...transaction,
          amount: parseFloat(transaction.amount),
      };
  
      if (editingTransaction) {
          onSubmit({ ...submittedTransaction, id: editingTransaction.id });
      } else {
          onSubmit(submittedTransaction);
      }
  
      setTransaction({
          amount: '',
          type: 'expense',
          category: '',
          note: '',
          date: new Date().toLocaleDateString('en-CA'),
      });
  };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-end'>
            <div className='bg-neutral-100 p-6 z-60 w-2/5'>
                <p className='text-center'>入力</p>
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-6">
                        <label className="block text-gray-700">収入/支出</label>
                        <SelectButton
                            value={transaction.type}
                            options={typeOptions}
                            onChange={(e) => setTransaction({ ...transaction, type: e.value })}
                            className="custom-select-button"
                            
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">金額</label>
                        <input
                            name="amount"
                            value={transaction.amount}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-6">
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
                    <div className="mb-12">
                        <label className="block text-gray-700">日付</label>
                        <Calendar
                            value={new Date(transaction.date)}
                            onChange={(e) => handleChange({ target: { name: 'date', value: e.value ? e.value.toLocaleDateString('en-CA') : '' } } as React.ChangeEvent<HTMLInputElement>)}
                            className="mt-1 w-full rounded-md border"
                            inputStyle={{ padding: '0.5rem', width: '100%', borderRight: '1px solid #d3d3d3' }}
                            showIcon
                            required
                            dateFormat="yy-mm-dd"
                        />
                    </div>
                    <div className="mb-4 border-t-2">
                        <label className="block text-gray-700 mt-4">メモ</label>
                        <input
                            type="text"
                            name="note"
                            value={transaction.note}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
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
                {/* <div className='border-t-4 pt-4 mt-5'>
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
                </div> */}
            </div>
        </div>
    );
};

export default TransactionForm;