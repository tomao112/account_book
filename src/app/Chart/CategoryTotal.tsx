import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { supabase } from '@/app/lib/supabaseClient';
import { Transaction } from '@/app/income-expense/transactions';
import { calculateMonthlySummaryAndCategoryTotals } from '@/app/components/util/transactionUtil';
import { IoIosSearch } from "react-icons/io";

interface CategoryTotalProps {
    selectedMonth: Date; // 選択された月を受け取る
    activeIndex: number; // タブのインデックスを受け取る
}

function CategoryTotal({ selectedMonth, activeIndex }: CategoryTotalProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: { total: number; type: string } }>({});
    const [monthlySummary, setMonthlySummary] = useState({ income: 0, expense: 0, deposit: 0 });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 選択されたカテゴリーを管理
    const [globalFilterValue, setGlobalFilterValue] = useState<string>(''); // 検索機能用

    useEffect(() => {
        const { summary, totals } = calculateMonthlySummaryAndCategoryTotals(transactions, selectedMonth);
        setMonthlySummary(summary);
        setCategoryTotals(totals as { [key: string]: { total: number; type: string } });
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
    }, []);

    // タブに応じてフィルタリング
    const filteredTotals = Object.entries(categoryTotals).filter(([category, { total, type }]) => {
        if (activeIndex === 0) {
            return type === 'income'; // 収入タブの場合
        } else if (activeIndex === 1) {
            return type === 'expense'; // 支出タブの場合
        } else if (activeIndex === 2) {
            return type === 'deposit'; // 貯金タブの場合
        } else {
            return false; // 予算タブの場合は何も表示しない
        }
    }).filter(([category]) => category.toLowerCase().includes(globalFilterValue.toLowerCase())); // 検索機能

    const statusBodyTemplate = (rowData: { type: string }) => {
        return <Tag value={rowData.type} severity={getSeverity(rowData.type)} />;
    };

    const getSeverity = (type: string) => {
        switch (type) {
            case 'income':
                return 'success';
            case 'expense':
                return 'danger';
            case 'deposit':
                return 'info';
            default:
                return null;
        }
    };

    // const actionBodyTemplate = () => {
    //     return <div className='relative top-4'><SpeedDialComponents /></div>;
    // };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                {/* <h4 className="m-0">カテゴリーごとの月の収支</h4> */}
                <div style={{ marginLeft: '18rem', marginBottom: '1rem' }}>
									<IoIosSearch style={{ left: '0.6rem', top: '37%', transform: 'translateY(-50%)', fontSize: '1.3rem', color: 'gray'}} />
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="カテゴリー検索" style={{ paddingLeft: '2.5rem', borderColor: '#d3d3d3', width: '13rem', border: '1px solid #d3d3d3', fontSize: '0.9rem', padding: '0.5rem 2.3rem', margin: '0 3rem 1rem 0' ,borderRadius: '0.5rem'}}  />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    // 行のスタイルを設定
    const rowClassName = (data: any) => {
        return selectedCategories.includes(data[0]) ? 'selected-row' : '';
    };

		return (
			<div className="card border rounded-lg p-8 w-[35rem] h-96 shadow-xl">
					{header}
					<div className="h-[calc(100%-80px)] overflow-y-auto">
							<DataTable 
									value={filteredTotals} 
									dataKey="0" 
									emptyMessage="No categories found." 
									rowClassName={rowClassName}
									className="border-none"
									stripedRows
									rows={5}
									showGridlines={false}
									scrollable
									scrollHeight="100%"
							>
									<Column 
											field="0" 
											header="Category" 
											body={(rowData) => (
													<div className="flex items-center gap-2 py-2">
															<span className="w-2 h-2 rounded-full bg-blue-500"></span>
															<span className="font-medium">{rowData[0]}</span>
													</div>
											)} 
											sortable 
											className="text-gray-700"
											frozen
									/>
									<Column 
											field="1.total" 
											header="Total" 
											body={(rowData) => (
													<div className="font-semibold text-gray-800">
															¥{rowData[1].total.toLocaleString()}
													</div>
											)} 
											sortable 
									/>
									<Column 
											header="Action" 
											className="w-24" 
									/>
							</DataTable>
					</div>
			</div>
	);
}

export default CategoryTotal;