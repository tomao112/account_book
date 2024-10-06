import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';

interface BarGraphProps {
	transactions: Transaction[] | null;
  selectedMonth: Date; // 選択された月を受け取る
}

export default function BarGraph({ transactions, selectedMonth }: BarGraphProps) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // transactionsがnullまたはundefinedの場合は処理をスキップ
        if (!transactions) return;

        // typeがdepositのトランザクションのみをフィルタリングし、選択された月に基づいてフィルタリング
        const depositTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return  transaction.type === 'deposit' &&
                    transactionDate.getFullYear() === selectedMonth.getFullYear() &&
                    transactionDate.getMonth() === selectedMonth.getMonth();
        });

        // カテゴリーごとの合計を計算
        const categoryTotals: { [key: string]: number } = {};
        depositTransactions.forEach(transaction => {
            if (categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] += transaction.amount;
            } else {
                categoryTotals[transaction.category] = transaction.amount;
            }
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        const BarGraphData = {
            labels: labels,
            datasets: [
                {
                    label: '貯金',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(BarGraphData);
        setChartOptions(options);
    }, [transactions, selectedMonth]); // transactionsとselectedMonthが変更されたときに再計算

    return (
        <div className="card mr-10 ml-10">
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
}