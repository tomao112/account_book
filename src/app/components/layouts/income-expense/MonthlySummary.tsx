interface MonthlySummaryProps {
  summary: {
    income: number;
    expense: number;
    deposit: number;
  }
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ summary }) => {

  return (
    <div className="monthly-summary">
      <div>
      <h2>月の収支</h2>
      <p>収入: {summary.income.toLocaleString()}円</p>
      <p>支出: {summary.expense.toLocaleString()}円</p>
      <p>貯金: {summary.deposit.toLocaleString()}円</p>
      <p>差額: {summary.income - summary.expense - summary.deposit}円</p>

    </div>
    </div>
  );
};

export default MonthlySummary;
