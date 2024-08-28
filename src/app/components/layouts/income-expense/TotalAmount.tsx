import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

interface MonthlySummaryProps {
  selectedMonth: Date;
}

const TotalAmount: React.FC<MonthlySummaryProps> = ({ selectedMonth }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) {
        console.error(error);
        return;
      }

      let totalIncome = 0;
      let totalExpense = 0;

      transactions?.forEach((transaction) => {
        if (transaction.type === '収入') {
          totalIncome += parseFloat(transaction.amount);
        } else if (transaction.type === '支出') {
          totalExpense += parseFloat(transaction.amount);
        }
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
    };

    fetchMonthlySummary();

    const subscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        fetchMonthlySummary();  // 新しいデータが追加された際に再実行
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedMonth]);

  return (
    <div className="monthly-summary">
      <h2 className="text-xl font-bold">Monthly Summary for {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
      <div className="mt-4">
        <p className="text-green-600">Total Income: ¥{income.toLocaleString()}</p>
        <p className="text-red-600">Total Expense: ¥{expense.toLocaleString()}</p>
        <p className="text-blue-600">Net Balance: ¥{(income - expense).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TotalAmount;
