interface MonthlySummaryProps {
  summary: {
    income: number;
    expense: number;
    deposit: number;
  }
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ summary }) => {

  return (
    <div className="flex justify-around mt-4 border  rounded-tr-lg rounded-tl-lg mr-10 ml-10 pt-2 pb-1 bg-green-100">
      {/* <h2>月の収支</h2> */}
      <div className="text-center">
        <p className="text-xs">収入</p>
        <p className="text-sm">￥{summary.income.toLocaleString()}円</p>
      </div>
      <div className="text-center">
        <p className="text-xs">支出</p>
        <p className="text-sm">￥{summary.expense.toLocaleString()}円</p>
      </div>
      <div className="text-center">
        <p className="text-xs">貯金</p>
        <p className="text-sm">￥{summary.deposit.toLocaleString()}円</p>
      </div>
      <div className="text-center">
        <p className="text-xs">差額</p>
        <p className="text-sm">￥{summary.income - summary.expense - summary.deposit}円</p>
      </div>
    </div>
  );
};

export default MonthlySummary;
