import React, { useEffect, useState } from 'react'; 
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { TabMenuTabChangeEvent } from 'primereact/tabmenu'; // 追加
import ExpenseBarGraph from '@/app/components/layouts/Chart/expenseChart'; // ここでBarGraphコンポーネントをインポート
import IncomeBarGraph from '@/app/components/layouts/Chart/incomeChart'; // ここでBarGraphコンポーネントをインポート
import DepositBarGraph from '@/app/components/layouts/Chart/depositChart'; // ここでBarGraphコンポーネントをインポート
// import BudgetPage from '@/app/components/layouts/Chart/budgetChart'; // ここでBarGraphコンポーネントをインポート
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import CategoryTotal from '@/app/components/layouts/Chart/CategoryTotal';
import MonthlySummary from '../income-expense/MonthlySummary';
import { calculateMonthlySummaryAndCategoryTotals, calculateMonthSummary, getFilterTransactions } from '@/app/components/util/transactionUtil';


interface BarGraphProps {
    transactions: Transaction[] | null;
    selectedMonth: Date; // 選択された月を受け取る
}

export default function Tab({ transactions, selectedMonth }: BarGraphProps) {
    const [ activeIndex, setActiveIndex ] = useState(0); // 選択されたタブのインデックス
		const [ monthlySummary, setMonthlySummary ] = useState({ income: 0, expense: 0, deposit: 0});
    const [ categoryTotals, setCategoryTotals ] = useState<{ [key: string]: { total: number; type: string } }>({});
		const [ underLine, setunderLine ] = useState('収入');


    // タブメニューのアイコン
		const items: MenuItem[] = [
			{ 
					label: '収入', 
					icon: 'pi pi-home',
					template: (item) => (
							<button 
									onClick={() => setActiveIndex(0)} 
									className={`flex items-center justify-center w-40 gap-2 pb-2 border-b-2 ${activeIndex === 0 ? 'border-muted-green' : 'border-transparent'}`}
							>
									<i className={item.icon}></i>
									<span>{item.label}</span>
							</button>
					)
			},
			{ 
					label: '支出', 
					icon: 'pi pi-chart-line',
					template: (item) => (
							<button 
									onClick={() => setActiveIndex(1)} 
									className={`flex items-center justify-center w-40 gap-2 pb-2 border-b-2 ${activeIndex === 1 ? 'border-muted-red' : 'border-transparent'}`}
							>
									<i className={item.icon}></i>
									<span>{item.label}</span>
							</button>
					)
			},
			{ 
					label: '貯金', 
					icon: 'pi pi-list',
					template: (item) => (
							<button 
									onClick={() => setActiveIndex(2)} 
									className={`flex items-center justify-center w-40 gap-2 pb-2 border-b-2 ${activeIndex === 2 ? 'border-muted-blue' : 'border-transparent'}`}
							>
									<i className={item.icon}></i>
									<span>{item.label}</span>
							</button>
					)
			}
	];
    // const handleTabChange = (e: TabMenuTabChangeEvent) => {
    //     setActiveIndex(e.index);
    // };

    // 月や値が変更されるたびに月ごとのカテゴリーごとの合計を計算し、更新
    useEffect(() => {
        if (transactions) {
            const { summary, totals } = calculateMonthlySummaryAndCategoryTotals(transactions, selectedMonth);
            setMonthlySummary(summary);
            setCategoryTotals(totals as { [key: string]: { total: number; type: string } });
        }
    }, [selectedMonth, transactions]);

// コンポーネント内で使用
return (
    <div className=''>
        <div className='flex justify-center'>
            <TabMenu className='p-3 mb-5 mt-5 border rounded-lg w-2/3' model={items} activeIndex={activeIndex} />
        </div>
        <div className=''>
            {activeIndex === 0 && (
                <div className='flex justify-center items-end gap-6'>
                    <IncomeBarGraph transactions={transactions} selectedMonth={selectedMonth} />
										<div className='flex flex-col items-center'>
											{/* <MonthlySummary summary={monthlySummary} /> */}
											<CategoryTotal selectedMonth={selectedMonth} activeIndex={activeIndex}/>
										</div>
                </div>
            )}
        </div>
        <div>
            {activeIndex === 1 && (
                <div className='flex justify-center items-end gap-6'>
                    <ExpenseBarGraph transactions={transactions} selectedMonth={selectedMonth} />
										<div className='flex flex-col items-center'>
											{/* <MonthlySummary summary={monthlySummary} /> */}
											<CategoryTotal selectedMonth={selectedMonth} activeIndex={activeIndex}/>
										</div>
                </div>
            )}
						
        </div>
        <div>
            {activeIndex === 2 && (
                <div className='flex justify-center items-end gap-6'>
                    <DepositBarGraph transactions={transactions} selectedMonth={selectedMonth} />
										<div className='flex flex-col items-center'>
											{/* <MonthlySummary summary={monthlySummary} /> */}
											<CategoryTotal selectedMonth={selectedMonth} activeIndex={activeIndex}/>
										</div>
                </div>
            )}
						
        </div>
        {/* <div>
            {activeIndex === 3 && (
                <>
                    <BudgetPage />
                </>
            )}		
        </div> */}
    </div>
);
}