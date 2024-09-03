interface MonthlySummaryProps {
  summary: {
    income: number;
    expense: number;
  }
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ summary }) => {

  return (
    <div className="monthly-summary">
      <div>
      <h2>月の収支</h2>
      <p>収入: {summary.income}円</p>
      <p>支出: {summary.expense}円</p>
      <p>差額: {summary.income - summary.expense}円</p>
    </div>
    </div>
  );
};

export default MonthlySummary;
