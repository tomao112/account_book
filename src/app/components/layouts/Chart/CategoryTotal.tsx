import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import { calculateMonthlySummaryAndCategoryTotals } from '@/app/components/util/transactionUtil';

interface CategoryTotalProps {
    selectedMonth: Date; // 選択された月を受け取る
    activeIndex: number; // タブのインデックスを受け取る
}

function CategoryTotal({ selectedMonth, activeIndex }: CategoryTotalProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({});
    const [monthlySummary, setMonthlySummary] = useState({ income: 0, expense: 0, deposit: 0 });

    useEffect(() => {
        const { summary, totals } = calculateMonthlySummaryAndCategoryTotals(transactions, selectedMonth);
        setMonthlySummary(summary);
        setCategoryTotals(totals);
    }, [selectedMonth, transactions]);

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
            }
        };

        fetchTransactions();

        const subscription = supabase
            .channel('public:transactions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
                console.log('Change received!', payload);
                fetchTransactions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // タブに応じてフィルタリング
    const filteredTotals = Object.entries(categoryTotals).filter(([category, total]) => {
        if (activeIndex === 0) {
            return total > 0; // 収入タブの場合
        } else {
            return total < 0; // 支出タブの場合
        }
    });

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">カテゴリーごとの月の収支</h3>
            <ul className="bg-gray-100 p-4 rounded-lg shadow-md">
                {filteredTotals.map(([category, total]) => (
                    <li key={category} className="flex justify-between py-2 border-b last:border-b-0">
                        <span className="font-medium">{category}</span>
                        <span className={`font-bold ${total < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ¥{total.toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryTotal;