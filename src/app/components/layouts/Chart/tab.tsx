import React, { useState } from 'react'; 
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { TabMenuTabChangeEvent } from 'primereact/tabmenu'; // 追加
import BarGraph from '@/app/components/layouts/Chart/chart'; // ここでBarGraphコンポーネントをインポート
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import CategoryTotal from '@/app/components/layouts/Chart/CategoryTotal';

interface BarGraphProps {
    transactions: Transaction[] | null;
    selectedMonth: Date; // 選択された月を受け取る
}

export default function Tab({ transactions, selectedMonth }: BarGraphProps) {
    const [activeIndex, setActiveIndex] = useState(0); // 選択されたタブのインデックス

    const items: MenuItem[] = [
        { label: '収入', icon: 'pi pi-home' },
        { label: '支出', icon: 'pi pi-chart-line' },
        { label: '貯金', icon: 'pi pi-list' },
        { label: '差額', icon: 'pi pi-inbox' }
    ];
    const handleTabChange = (e: TabMenuTabChangeEvent) => {
        setActiveIndex(e.index);
    };

// コンポーネント内で使用
return (
    <div>
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={handleTabChange} />
        <div>
            {activeIndex === 0 && (
                <>
                    収入
                </>
            )}
						
        </div>
        <div>
            {activeIndex === 1 && (
                <>
                    <BarGraph transactions={transactions} selectedMonth={selectedMonth} />
                    <CategoryTotal selectedMonth={selectedMonth} />
                </>
            )}
						
        </div>
        <div>
            {activeIndex === 2 && (
                <>
                    貯金
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