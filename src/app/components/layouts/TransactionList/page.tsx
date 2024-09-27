'use client'
import { FC, useState, useEffect } from 'react';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import MonthlySummary from '@/app/components/layouts/income-expense/MonthlySummary';
import { supabase } from '@/app/lib/supabaseClient';
import { calculateMonthSummary, getFilterTransactions, calculateMonthlyCategoryTotals, calculateMonthlySummaryAndCategoryTotals} from '@/app/components/util/transactionUtil';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
	onDelete: (id: number) => void;
}

const TransactionList: FC<TransactionListProps> = ({ onEdit, onDelete }) => {
  // 編集中のトランザクションを保持
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [ selectedMonth, setSelectedMonth ] = useState(() => new Date());
  const [ monthlySummary, setMonthlySummary ] = useState({ income: 0, expense: 0, deposit: 0});
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({}); // カテゴリーごとの収支を管理

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleSaveEdit = async (updatedTransaction: Transaction) => {
    onEdit(updatedTransaction);
    handleCancelEdit();
  };

    // 選択された月やトランザクションが変更されるたびに、フィルタリングされたトランザクションに基づいて月のサマリーを更新
    useEffect(() => {
      const filteredTransactions = getFilterTransactions(transactions, selectedMonth);
      const summary = calculateMonthSummary(filteredTransactions);
      setMonthlySummary(summary); // 'deposit' プロパティを追加してデフォルト値を設定
    }, [selectedMonth, transactions]);


  // 月の変更
  const changeMonth = (increment: number): void => {
    setSelectedMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  useEffect(() => {
    const { summary, totals } = calculateMonthlySummaryAndCategoryTotals(transactions, selectedMonth);
    setMonthlySummary(summary);
    setCategoryTotals(totals);
}, [selectedMonth, transactions]);

  // トランザクションリストを取得
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
      fetchTransactions();
    })
    .subscribe();
  return () => {
    // コンポーネントがアンマウントされるときにsupabaseのサブスクリプションを解除してリソースを開放する
    // メモリリークや無駄なリソースを避ける
    supabase.removeChannel(subscription);
  };
  }, []);


  return (
<div className="overflow-x-auto">
  <div className="flex justify-end mr-20 mt-5 items-center">
    <button onClick={() => changeMonth(-1)} className="border text-black px-2 py-1 rounded">
      &lt;
    </button>
    <h2 className="pr-2 pl-2">
      {selectedMonth.getFullYear()}-{selectedMonth.getMonth() + 1}
    </h2>
    <button onClick={() => changeMonth(+1)} className="border text-black px-2 py-1 rounded">
      &gt;
    </button>
  </div>
  <div>
    <MonthlySummary summary={monthlySummary} />
  </div>
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
