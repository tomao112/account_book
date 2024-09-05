import React, { useEffect, useState } from 'react'; 
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { TabMenuTabChangeEvent } from 'primereact/tabmenu'; // 追加
import ExpenseBarGraph from '@/app/components/layouts/Chart/expenseChart'; // ここでBarGraphコンポーネントをインポート
import IncomeBarGraph from '@/app/components/layouts/Chart/incomeChart'; // ここでBarGraphコンポーネントをインポート
import DepositBarGraph from '@/app/components/layouts/Chart/depositChart'; // ここでBarGraphコンポーネントをインポート
import budgetBarGraph from '@/app/components/layouts/Chart/budgetChart'; // ここでBarGraphコンポーネントをインポート
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import CategoryTotal from '@/app/components/layouts/Chart/CategoryTotal';
import MonthlySummary from '../income-expense/MonthlySummary';
import { calculateMonthSummary, getFilterTransactions } from '@/app/components/util/transactionUtil';


interface BarGraphProps {
    transactions: Transaction[] | null;
    selectedMonth: Date; // 選択された月を受け取る
}

export default function Tab({ transactions, selectedMonth }: BarGraphProps) {
    const [activeIndex, setActiveIndex] = useState(0); // 選択されたタブのインデックス
		const [ monthlySummary, setMonthlySummary ] = useState({ income: 0, expense: 0, deposit: 0});

    const items: MenuItem[] = [
        { label: '収入', icon: 'pi pi-home' },
        { label: '支出', icon: 'pi pi-chart-line' },
        { label: '貯金', icon: 'pi pi-list' },
        { label: '予算', icon: 'pi pi-inbox' }
    ];
    const handleTabChange = (e: TabMenuTabChangeEvent) => {
        setActiveIndex(e.index);
    };

		    // 選択された月やトランザクションが変更されるたびに、フィルタリングされたトランザクションに基づいて月のサマリーを更新
				useEffect(() => {
					const filteredTransactions = getFilterTransactions(transactions = [], selectedMonth);
					const summary = calculateMonthSummary(filteredTransactions);
					setMonthlySummary(summary); // 'deposit' プロパティを追加してデフォルト値を設定
				}, [selectedMonth, transactions]);

// コンポーネント内で使用
return (
    <div>
        <TabMenu className='mr-10 ml-10 mb-5 mt-5 border border-pink-500 rounded-lg' model={items} activeIndex={activeIndex} onTabChange={handleTabChange} />
        <div>
            {activeIndex === 0 && (
                <>
                    <IncomeBarGraph transactions={transactions} selectedMonth={selectedMonth} />
					<MonthlySummary summary={monthlySummary} />
                    <CategoryTotal selectedMonth={selectedMonth} activeIndex={activeIndex}/>
                </>
            )}
						
        </div>
        <div>
            {activeIndex === 1 && (
                <>
									
                    <ExpenseBarGraph transactions={transactions} selectedMonth={selectedMonth} />
                    <MonthlySummary summary={monthlySummary} />
                    <CategoryTotal selectedMonth={selectedMonth} activeIndex={activeIndex}/>
									
                </>
            )}
						
        </div>
        <div>
            {activeIndex === 2 && (
                <>
                    <ExpenseBarGraph transactions={transactions} selectedMonth={selectedMonth} />
                    <MonthlySummary summary={monthlySummary} />
                    <CategoryTotal selectedMonth={selectedMonth} activeIndex={activeIndex}/>
                </>
            )}
						
        </div>
        <div>
            {activeIndex === 3 && (
                <>
                    予算
                </>
            )}
						
        </div>
    </div>
);
}