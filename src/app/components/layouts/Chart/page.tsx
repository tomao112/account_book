'use client'
import { FC, useState, useEffect } from 'react';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import { supabase } from '@/app/lib/supabaseClient';
import Tab from '@/app/components/layouts/Chart/tab';
import { calculateMonthlySummaryAndCategoryTotals} from '@/app/components/util/transactionUtil';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
	onDelete: (id: number) => void;
}

const TransactionList: FC<TransactionListProps> = () => {
  const [ selectedMonth, setSelectedMonth ] = useState(() => new Date());
  const [ monthlySummary, setMonthlySummary ] = useState({ income: 0, expense: 0, deposit: 0});
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: { total: number; type: string } }>({});

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
    setCategoryTotals(totals as unknown as { [key: string]: { total: number; type: string } });
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

// トランザクションリストを取得
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
      
      // カテゴリーごとの合計を計算
      const categoryTotals: { [key: string]: number } = {};
      data.forEach(transaction => {
        if (transaction.type === 'expense') { // 支出トランザクションのみを考慮
          if (categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] += transaction.amount;
          } else {
            categoryTotals[transaction.category] = transaction.amount;
          }
        }
      });
			console.log('Category Totals:', categoryTotals);
      // カテゴリー合計を適切な型に変換して設定
      const formattedCategoryTotals = Object.entries(categoryTotals).reduce((acc, [key, value]) => {
        acc[key] = { total: value, type: 'expense' };
        return acc;
      }, {} as { [key: string]: { total: number; type: string; }; });
      setCategoryTotals(formattedCategoryTotals);
    }
  };

  fetchTransactions();
}, [selectedMonth]); // selectedMonthが変更されたときに再取得

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
			<Tab transactions={transactions} selectedMonth={selectedMonth} />
		</div>
  </div>
);
}

export default TransactionList;
