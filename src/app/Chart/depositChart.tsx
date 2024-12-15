"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Transaction } from "@/app/income-expense/transactions";

interface ChartProps {
	transactions: Transaction[] | null;
	selectedMonth: Date; // 選択された月を受け取る
}

// ... existing code ...
// ... existing code ...
export default function IncomeComponents({ transactions, selectedMonth }: ChartProps) {
  const [chartData, setChartData] = useState<{ category: string; amount: number }[]>([]);

  useEffect(() => {
    if (!transactions) return;

    // incomeトランザクションのみをフィルタリングし、選択された月に基づいてフィルタリング
    const incomeTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return  transaction.type === 'income' &&
              transactionDate.getFullYear() === selectedMonth.getFullYear() &&
              transactionDate.getMonth() === selectedMonth.getMonth();
    });

    // カテゴリーごとの合計を計算
    const categoryTotals: { [key: string]: number } = {};
    incomeTransactions.forEach(transaction => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });

    const newChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));

    setChartData(newChartData); // chartDataを更新
  }, [transactions, selectedMonth]); // 依存配列に追加
	console.log(transactions)

	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "#FFB3BA", // パステルピンク
		},
		mobile: {
			label: "Mobile",
			color: "#FFDFBA", // パステルオレンジ
		},
		income: {
			label: "Income",
			color: "#BAFFC9", // パステルグリーン
		},
	} satisfies ChartConfig;

  return (
    <div className="border p-4 bg-white rounded-lg shadow-md w-[56rem]">
      {/* <h2 className="text-xl font-semibold text-center">Income Chart</h2> */}
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full p-4">
        <BarChart accessibilityLayer data={chartData} height={300} width={500}>
				<XAxis
					dataKey="category"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
					fontSize="10px"
					stroke="#888"
					interval={0}
					padding={{ left: 10, right: 10 }}
				/>
				<Tooltip content={<ChartTooltipContent />} />
					<Bar dataKey="amount" fill={chartConfig.income.color} radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}