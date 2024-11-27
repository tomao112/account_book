interface MonthlySummaryProps {
  summary: {
    income: number;
    expense: number;
    deposit: number;
  }
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ summary }) => {

  return (
    <div className="flex justify-around mt-4 border rounded-tr-lg rounded-tl-lg mr-32 ml-32 pt-2 pb-1 bg-white w-2/4">
      {/* <h2>月の収支</h2> */}
      <div className="text-center">
        <p className="text-xs text-gray-500">収入</p>
        <p className="text-sm text-muted-green">￥{summary.income.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">支出</p>
        <p className="text-sm text-muted-red">￥{summary.expense.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">貯金</p>
        <p className="text-sm text-muted-blue">￥{summary.deposit.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">差額</p>
        <p className="text-sm text-gray-600">￥{summary.income - summary.expense - summary.deposit}</p>
      </div>
    </div>
  );
};

export default MonthlySummary;
