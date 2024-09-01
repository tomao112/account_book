import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

interface MonthlySummaryProps {
  selectedMonth: Date;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ selectedMonth }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const fetchMonthlySummary = async () => {
    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    let totalIncome = 0;
    let totalExpense = 0;

    data?.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += parseFloat(transaction.amount);
      } else if (transaction.type === 'expense') {
        totalExpense += parseFloat(transaction.amount);
      }
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
  };

  useEffect(() => {
    fetchMonthlySummary();

    // Supabaseの変更をリアルタイムで監視する
    const subscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        console.log('Change detected:', payload);
        fetchMonthlySummary(); // データが変更されたら再取得して再レンダリング
      })
      .subscribe();

    return () => {
      // コンポーネントのアンマウント時にサブスクリプションを解除する
      supabase.removeChannel(subscription);
    };
  }, [selectedMonth]);

  return (
    <div className="monthly-summary">
      <h2 className="text-xl font-bold">Monthly Summary for {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
      <div className="mt-4">
        <p className="text-green-600">Total income: {income.toLocaleString()}</p>
        <p className="text-red-600">Total expense: {expense.toLocaleString()}</p>
        <p className="text-blue-600">Net balance: {(income - expense).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MonthlySummary;
