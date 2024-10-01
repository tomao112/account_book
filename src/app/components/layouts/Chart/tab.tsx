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

    return (
        <div className="card">
            <TabMenu model={items} activeIndex={activeIndex} onTabChange={handleTabChange} />
            <div className="mt-4">
                {activeIndex === 1 && ( // 支出タブが選択されたとき
                    <><BarGraph transactions={transactions} selectedMonth={selectedMonth} />
										<CategoryTotal selectedMonth={selectedMonth}/></>
                )}
                {/* 他のタブに応じたチャートを表示 */}
            </div>
						
        </div>
    );
}