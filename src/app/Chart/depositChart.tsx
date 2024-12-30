import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Transaction } from '@/app/income-expense/transactions';

interface BarGraphProps {
    transactions: Transaction[] | null;
    selectedMonth: Date; // 選択された月を受け取る
}

export default function ExpenseBarGraph({ transactions, selectedMonth }: BarGraphProps) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // transactionsがnullまたはundefinedの場合は処理をスキップ
        if (!transactions) return;

        // typeがexpenseのトランザクションのみをフィルタリングし、選択された月に基づいてフィルタリング
        const expenseTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return  transaction.type === 'deposit' &&
                    transactionDate.getFullYear() === selectedMonth.getFullYear() &&
                    transactionDate.getMonth() === selectedMonth.getMonth();
        });

        // カテゴリーごとの合計を計算
        const categoryTotals: { [key: string]: number } = {};
        expenseTransactions.forEach(transaction => {
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
            maintainAspectRatio: false,
            height: 500,
            aspectRatio: 0.75,
            layout: {
                padding: 0
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 10,
                            '@media (min-width: 768px)': {
                                size: 12
                            }
                        }
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 10,
                            '@media (min-width: 768px)': {
                                size: 12
                            }
                        }
                    },
                    border: {
                        display: false
                    },
                    grid: {
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };

        // データセットの幅を調整（カテゴリーごとの最小幅を設定）
        const minBarWidth = 80; // 各バーの最小幅（ピクセル）
        const totalMinWidth = labels.length * minBarWidth;
        
        setChartData({
            ...BarGraphData,
            datasets: [{
                ...BarGraphData.datasets[0],
                barPercentage: 0.8,
                categoryPercentage: 0.9
            }]
        });

        setChartData(BarGraphData);
        setChartOptions(options);
    }, [transactions, selectedMonth]); // transactionsとselectedMonthが変更されたときに再計算

    return (
        <div className="card border rounded-lg p-3 sm:p-4 md:p-6 shadow-xl h-[574px] w-full">
            <div className="h-[500px]">
                <div className="h-full w-full">
                    <Chart 
                        type="bar" 
                        data={chartData} 
                        options={{
                            ...chartOptions,
                            maintainAspectRatio: false,
                        }} 
                    />
                </div>
            </div>
        </div>
    );
}