'use client'
import { FC, useState, useEffect } from 'react';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import MonthlySummary from '@/app/components/layouts/income-expense/MonthlySummary';
import { supabase } from '@/app/lib/supabaseClient';
import { calculateMonthSummary, getFilterTransactions, calculateMonthlySummaryAndCategoryTotals } from '@/app/components/util/transactionUtil';
import EditButton from '@/app/components/layouts/TransactionList/EditButton';
import DeleteButton from '@/app/components/layouts/TransactionList/DeleteButton';
import SaveButton from '@/app/components/layouts/TransactionList/SaveButton';
import CancelButton from '@/app/components/layouts/TransactionList/CancelButton';

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

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

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

  useEffect(() => {
    const filteredTransactions = getFilterTransactions(transactions, selectedMonth);
    const summary = calculateMonthSummary(filteredTransactions);
    setMonthlySummary(summary);
  }, [selectedMonth, transactions]);

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
    setCategoryTotals(totals as unknown as { [key: string]: { total: number; type: string } });
  }, [selectedMonth, transactions]);

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

    const subscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        console.log('Change received!', payload);
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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

      <div className='ml-10 mr-10'>
        <table className="w-full border rounded-lg shadow-md">
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
                  <td className="border px-4 py-3 flex items-center justify-center">
                    {editingTransaction?.id === transaction.id ? (
                      <div className='flex gap-3 items-center justify-center'>
                        <SaveButton 
                          onClick={() => 
                          handleSaveEdit(editingTransaction)}
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
                          handleDeleteTransaction(transaction.id) // 削除ボタンをクリックしたときに削除処理を呼び出す
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
  );
}

export default TransactionList;