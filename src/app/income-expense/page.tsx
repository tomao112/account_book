'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { Transaction } from './transactions';
import Calendar from '@/app/components/calendar/calendar';
// import TransactionList from '@/app/components/layouts/ToransactionList/TransactionList';
import TransactionForm from '@/app/income-expense/TransactionForm';
import MonthlySummary from '@/app/income-expense/MonthlySummary';
import TransactionModel from './TransactionModel';
import { calculateMonthSummary, getFilterTransactions, calculateMonthlyCategoryTotals, calculateMonthlySummaryAndCategoryTotals} from '@/app/components/util/transactionUtil';


export default function Home() {
  // transactions　トランザクションのリストを保持
  // selectedDate カレンダーで選択された日付を保持
  // monthlySummary 月ごとの収支を保持
  // selectedMonth 現在選択されている月を保持
  // editingTransaction 編集中のトランザクションを保持
  // isModelOpen トランザクションモデルの表示状態 
  // isEditing フォームの編集状態
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [ selectedDate, setSelectedDate ] = useState<Date | null>(null);
  const [ monthlySummary, setMonthlySummary ] = useState({ income: 0, expense: 0, deposit: 0});
  const [ selectedMonth, setSelectedMonth ] = useState(() => new Date());
  const [ editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction[]>([]);
  const [ isModelOpen, setIsModelOpen ] = useState(false);
  const [ isEditing, setIsEditing] = useState(false);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: { total: number; type: string } }>({});


  // カレンダーの日付選択時にその日付のトランザクションを設定
  const handleDateClick = (date: Date, dayTransactions: Transaction[]) => {
    setSelectedDate(date);
    setSelectedTransaction(dayTransactions);
    setIsModelOpen(true);
  }

      // 選択された月やトランザクションが変更されるたびに、フィルタリングされたトランザクションに基づいて月のサマリーを更新
      useEffect(() => {
        const filteredTransactions = getFilterTransactions(transactions, selectedMonth);
        const summary = calculateMonthSummary(filteredTransactions);
        setMonthlySummary(summary); // 'deposit' プロパティを追加してデフォルト値を設定
      }, [selectedMonth, transactions]);

      useEffect(() => {
        const { summary, totals } = calculateMonthlySummaryAndCategoryTotals(transactions, selectedMonth);
        setMonthlySummary(summary);
        setCategoryTotals(totals as unknown as { [key: string]: { total: number; type: string } });
    }, [selectedMonth, transactions]);

  // toransactionModelを閉じる
  const handleModelClose = () => {
    setIsModelOpen(false);
    setIsEditing(false);
  }

  // transactionModelを閉じ、transactionFormを表示
  const handleAddNew = () => {
    setEditingTransaction(null); // 編集トランザクションをリセット
    setIsModelOpen(false); // TransactionModelを閉じる
    setIsEditing(true); // フォームを表示するための状態を設定
}

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

  // 新しいデータをsupabaseに追加
  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    console.log('handleAddTransaction called with:', newTransaction);

    const { data, error} = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select('*');

      if(error) {
        console.error('Error adding transaction:', error);
      } else if(data && data.length > 0) {
        console.log('New transaction added:', data[0]);
        setSelectedDate(null);
        setEditingTransaction(null);
      }
  }

  const handleEditTransaction = async (updatedTransaction: Transaction) => {
    console.log('handleEditiongTransaction called with:', updatedTransaction);

    const { data, error } = await supabase
      .from('transactions')
      .update(updatedTransaction)
      .eq('id', updatedTransaction.id)
      .select('*');

    if(error) {
      console.log('Error updating transaction:', error);
    } else if(data && data.length > 0) {
      console.log('Transaction updated:', data[0]);
      setEditingTransaction(null);
    }
  }

  // 指定されたデータをsupabaseで更新
  const handleEdit = (transaction: Transaction) => {
    setIsEditing(true);
    setIsModelOpen(false);
    setEditingTransaction(transaction);
    setSelectedDate(null);
  };
  
  // 指定されたデータをsupabaseから削除
  // const handleDelete = async (id: number) => {
  //   const { error } = await supabase
  //     .from('transactions')
  //     .delete()
  //     .eq('id', id);

  //   if (error) {
  //     console.error('Error deleting transaction:', error);
  //   } else {
  //     console.log('Transaction deleted:', id);
  //     setTransactions((prevTransactions) =>
  //       prevTransactions.filter((t) => t.id !== id)
  //     );
  //   }
  // };

  // 月の変更
  const changeMonth = (increment: number): void => {
    setSelectedMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  return (
    <main>
      <div className=''>
        <div className="flex justify-end mr-20 mt-5 items-center">
          <button onClick={() => changeMonth(-1)} className="border text-black px-2 py-1 rounded shadow-md">
            &lt;
          </button>
          <h2 className="pr-2 pl-2">
            {selectedMonth.getFullYear()}-{selectedMonth.getMonth() + 1}
          </h2>
          <button onClick={() => changeMonth(+1)} className="border text-black px-2 py-1 rounded shadow-md">
            &gt;
          </button>
        </div>
        <div className='flex justify-center'>
          <MonthlySummary summary={monthlySummary} />
        </div>
        <Calendar 
          selectedMonth={selectedMonth}
          transactions={transactions}
          onDateClick={handleDateClick}
          />
          <TransactionModel
            isOpen={isModelOpen}
            onClose={handleModelClose}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            date={selectedDate}
            transactions={selectedTransaction}
          />
      </div>
      <div className="container mx-auto p-4">
      {isEditing && (
        <TransactionForm
        selectedDate={selectedDate}
        editingTransaction={editingTransaction}
        onSubmit={(transaction) => {
            if ('id' in transaction) {
                handleEditTransaction(transaction as Transaction);
            } else {
                handleAddTransaction(transaction as Omit<Transaction, 'id'>);
            }
            setIsEditing(false); //フォームを閉じる
        }}
        onCancel={() => {
            setIsEditing(false); // フォームを閉じる
            setEditingTransaction(null); // 編集トランザクションをリセット
        }}
        />
      )}
      </div>
    </main>
  );
}
