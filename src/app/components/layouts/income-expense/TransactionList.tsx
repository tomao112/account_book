import { FC, useState } from 'react';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
// import { supabase } from '@/app/lib/supabaseClient';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
	onDelete: (id: number) => void;
}

const TransactionList: FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  // 編集中のトランザクションを保持
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleSaveEdit = async (updatedTransaction: Transaction) => {
    onEdit(updatedTransaction);
    handleCancelEdit();
  };

  // カテゴリーごとの月の収支を計算
const calculateMonthlyCategoryTotals = () => {
  const categoryTotals: { [key: string]: number } = {};

  transactions.forEach(transaction => {
    const category = transaction.category; // カテゴリーを取得
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  return categoryTotals;
};

// カテゴリーごとの収支を表示
const categoryTotals = calculateMonthlyCategoryTotals();


// ... existing code ...


  return (
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
        <th className="border px-4 py-3 text-left">金額</th>
        <th className="border px-4 py-3 text-left">支出/収入/貯金</th>
        <th className="border px-4 py-3 text-left">カテゴリー</th>
        <th className="border px-4 py-3 text-left">メモ</th>
        <th className="border px-4 py-3 text-left">日付</th>
        <th className="border px-4 py-3 text-left">編集/削除</th>
      </tr>
    </thead>
    <tbody className="text-gray-600 text-sm">
      {transactions.map((transaction) => (
        <tr key={transaction.id} className="border-b hover:bg-gray-100">
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="number"
                value={editingTransaction.amount}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.amount}</span>
            )}
          </td>
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <select
                value={editingTransaction.type}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              >
                <option value="expense">支出</option>
								<option value="income">収入</option>
								<option value="deposit">貯金</option>
              </select>
            ) : (
              <span>{ transaction.type === 'expense' ? '支出' :
                      transaction.type === 'income' ? '収入' :
                      '貯金'}</span>
            )}
          </td>
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="text"
                value={editingTransaction.category}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.category}</span>
            )}
          </td>
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="text"
                value={editingTransaction.note}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, note: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.note}</span>
            )}
          </td>
					<td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="text"
                value={editingTransaction.date}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.date}</span>
            )}
          </td>
          <td className="border px-4 py-3 flex items-center">
            {editingTransaction?.id === transaction.id ? (
              <>
                <button
                  onClick={() => handleSaveEdit(editingTransaction)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onEdit(transaction)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <div className="mt-4">
    <h3 className="text-lg font-bold mb-2">カテゴリーごとの月の収支</h3>
    <ul className="bg-gray-100 p-4 rounded-lg shadow-md">
      {Object.entries(categoryTotals).map(([category, total]) => (
        <li key={category} className="flex justify-between py-2 border-b last:border-b-0">
          <span className="font-medium">{category}</span>
          <span className={`font-bold ${total < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ¥{total.toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default TransactionList;
