// 日別の収支を表示するページ

'use client'
import { FC, useState, useEffect } from 'react';
import { Transaction } from '@/app/income-expense/transactions';
import MonthlySummary from '@/app/income-expense/MonthlySummary';
import { supabase } from '@/app/lib/supabaseClient';
import { calculateMonthSummary, getFilterTransactions, calculateMonthlySummaryAndCategoryTotals } from '@/app/components/util/transactionUtil';
import EditButton from '@/app/TransactionList/EditButton';
import DeleteButton from '@/app/TransactionList/DeleteButton';
import SaveButton from '@/app/TransactionList/SaveButton';
import CancelButton from '@/app/TransactionList/CancelButton';
import { Calendar } from 'primereact/calendar';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionList: FC<TransactionListProps> = ({ onEdit, onDelete }) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const [monthlySummary, setMonthlySummary] = useState({ income: 0, expense: 0, deposit: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: { total: number; type: string } }>({});

  // 編集用キャンセルボタンの処理
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // 編集した収支をsupabaseに保存し、即座に反映させる
  const handleSaveEdit = async (updatedTransaction: Transaction) => {
    // Supabaseでトランザクションを更新
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedTransaction)
      .eq('id', updatedTransaction.id);

    if (error) {
      console.error('Error updating transaction:', error);
    } else {
      // 更新されたトランザクションをリストに反映
      if (data) {
        setTransactions(transactions.map(t => (t.id === updatedTransaction.id ? data[0] : t)));
      }
      handleCancelEdit();
    }
  };

  // 月を変更したときにそれぞれの月の収支を取得
  useEffect(() => {
    const filteredTransactions = getFilterTransactions(transactions, selectedMonth);
    const summary = calculateMonthSummary(filteredTransactions);
    setMonthlySummary(summary);
  }, [selectedMonth, transactions]);

  // 月を変更する
  const changeMonth = (increment: number): void => {
    setSelectedMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };
  
  // 選択された月の収支とカテゴリの合計を計算し、状態を更新する
  // 必要ないかも？
  useEffect(() => {
    const { summary, totals } = calculateMonthlySummaryAndCategoryTotals(transactions, selectedMonth);
    setMonthlySummary(summary);
    setCategoryTotals(totals as unknown as { [key: string]: { total: number; type: string } });
  }, [selectedMonth, transactions]);

  // ページがレンダリングされたときに１度だけ実行される
  // 収支のデータをすべて取得し、表示する
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

    // 収支が変更されたときに最新のデータを再取得する
    const subscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        console.log('Change received!', payload);
        fetchTransactions();
      })
      .subscribe();

    return () => {
      // メモリリークを防ぎ、不要なリスニングを停止
      supabase.removeChannel(subscription);
    };
  }, []);

  // 削除ボタン用処理
  const handleDeleteTransaction = async (id: number) => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting transaction:', error);
    } else {
        // トランザクションリストを更新
        setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
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

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mr-20 mt-5 items-center">
        <button onClick={() => changeMonth(-1)} className="border text-black font-semibold px-2 py-1 rounded bg-white">
          &lt;
        </button>
        <h2 className="pr-2 pl-2 bg-white pt-1 pb-1">
          {selectedMonth.getFullYear()}-{selectedMonth.getMonth() + 1}
        </h2>
        <button onClick={() => changeMonth(+1)} className="border text-black font-semibold px-2 py-1 rounded bg-white">
          &gt;
        </button>
      </div>

      <div className='flex justify-center'>
        <MonthlySummary summary={monthlySummary} />
      </div>

      <div className='flex justify-center'>
        <div className='h-[calc(100vh-20rem)] overflow-y-auto bg-white w-3/4'>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="border px-4 py-3 text-left">金額</th>
                <th className="border px-4 py-3 text-left">支出/収入/貯金</th>
                <th className="border px-4 py-3 text-left">カテゴリー</th>
                <th className="border px-4 py-3 text-left">メモ</th>
                <th className="border px-4 py-3 text-left">日付</th>
                <th className="border px-4 py-3 text-left">編集/削除</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {transactions
                .filter(transaction => {
                  const transactionDate = new Date(transaction.date);
                  return (
                    transactionDate.getFullYear() === selectedMonth.getFullYear() &&
                    transactionDate.getMonth() === selectedMonth.getMonth()
                  );
                })
                .map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-100">
                    <td className="border px-4 py-2 w-1/6"> {/* 固定幅を設定 */}
                      {editingTransaction?.id === transaction.id ? (
                        <input
                          type="number"
                          value={editingTransaction.amount}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      ) : (
                        <span className="w-full">{transaction.amount}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 w-1/6">
                      {editingTransaction?.id === transaction.id ? (
                        <select
                          value={editingTransaction.type}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value })}
                          className="w-full px-4 py-2 border rounded-md"
                        >
                          <option value="expense">支出</option>
                          <option value="income">収入</option>
                          <option value="deposit">貯金</option>
                        </select>
                      ) : (
                        <span className="w-full">{transaction.type === 'expense' ? '支出' : transaction.type === 'income' ? '収入' : '貯金'}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 w-1/6">
                        {editingTransaction?.id === transaction.id ? (
                            <select
                                value={editingTransaction.category}
                                onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                            >
                                <option value="">選択してください</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="w-full">{transaction.category}</span>
                        )}
                    </td>
                    <td className="border px-4 py-2 w-1/6">
                      {editingTransaction?.id === transaction.id ? (
                        <input
                          type="text"
                          value={editingTransaction.note}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, note: e.target.value })}
                          className="w-full px-2 py-2 border rounded-md"
                        />
                      ) : (
                        <span className="w-full">{transaction.note}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 w-1/6">
                      {editingTransaction?.id === transaction.id ? (
                        <Calendar 
                          value={new Date(editingTransaction.date)}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.value ? e.value.toLocaleDateString('en-CA') : '' })}
                          className="w-full"
                          inputStyle={{ width: '6rem', borderColor: '#d3d3d3', borderRadius: '0.5rem', margin: 'initial', padding: '0.5rem', border: '1px solid #d3d3d3' }}
                          // showIcon
                          dateFormat='yy/mm/dd'
                          placeholder='日付を選択'/>
                      ) : (
                        <span className="w-full">{transaction.date}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex items-center justify-center border-l border-r">
                      {editingTransaction?.id === transaction.id ? (
                        <div className='flex gap-3 items-center justify-center'>
                          <SaveButton 
                            onClick={() => handleSaveEdit(editingTransaction)}
                          />
                          <CancelButton 
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <div className='flex gap-3 items-center justify-center'>
                          <EditButton
                            onClick={() => {
                              setEditingTransaction(transaction); // 編集ボタンをクリックしたときにトランザクションを設定
                            }} />
                          <DeleteButton
                            onClick={() => {
                              handleDeleteTransaction(transaction.id); // 削除ボタンをクリックしたときに削除処理を呼び出す
                            }} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionList;