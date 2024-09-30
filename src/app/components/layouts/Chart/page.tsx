'use client'
import { FC, useState, useEffect } from 'react';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import MonthlySummary from '@/app/components/layouts/income-expense/MonthlySummary';
import { supabase } from '@/app/lib/supabaseClient';
import { calculateMonthSummary, getFilterTransactions, calculateMonthlySummaryAndCategoryTotals} from '@/app/components/util/transactionUtil';
import BarGraph from '@/app/components/layouts/Chart/chart';
import Tab from '@/app/components/layouts/Chart/tab';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
	onDelete: (id: number) => void;
}

const TransactionList: FC<TransactionListProps> = () => {
  const [ selectedMonth, setSelectedMonth ] = useState(() => new Date());
  const [ monthlySummary, setMonthlySummary ] = useState({ income: 0, expense: 0, deposit: 0});
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [ categoryTotals, setCategoryTotals ] = useState<{ [key: string]: number }>({}); // カテゴリーごとの収支を管理

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



    {/* 選択されている月の収支を表示 */}
    <div>
      <MonthlySummary summary={monthlySummary} />
    </div>

				<div>
			<Tab />
		</div>
		<div className=''>
      <BarGraph categoryTotals={categoryTotals}/>
    </div>
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
}

export default TransactionList;
