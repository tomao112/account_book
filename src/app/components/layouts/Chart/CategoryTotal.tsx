import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { supabase } from '@/app/lib/supabaseClient';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
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

    const actionBodyTemplate = () => {
        return <Button type="button" icon="pi pi-cog" rounded></Button>;
    };

    // ラジオボタンのカスタムボディ
    const radioButtonBodyTemplate = (rowData: any) => {
        const isSelected = selectedCategories.includes(rowData[0]);
        return (
            <div>
                <input
                    type="checkbox" // 複数選択を可能にするためにcheckboxに変更
                    name="category" // 同じ名前でグループ化
                    value={rowData[0]} // カテゴリー名を値として使用
                    checked={isSelected} // 選択されたカテゴリーと比較
                    onChange={() => {
                        if (isSelected) {
                            setSelectedCategories(selectedCategories.filter(category => category !== rowData[0])); // 選択解除
                        } else {
                            setSelectedCategories([...selectedCategories, rowData[0]]); // 選択追加
                        }
                    }} // 選択されたカテゴリーを更新
                    className='large-radio'
                />
            </div>
        );
    };

       // 全選択ラジオボタン
    const selectAllRadioButton = () => {
        const allSelected = filteredTotals.length === selectedCategories.length;
        return (
            <div>
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => {
                        if (allSelected) {
                            setSelectedCategories([]); // 全選択解除
                        } else {
                            setSelectedCategories(filteredTotals.map(row => row[0])); // 全選択
                        }
                    }}
                    className='large-radio'
                />
            </div>
        );
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">カテゴリーごとの月の収支</h4>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                <IoIosSearch style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.3rem', color: 'gray'}} />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="カテゴリー検索" style={{ paddingLeft: '2.5rem' }}  />
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
        <div className="card mr-10 ml-10 border">
            {header}
            <DataTable  value={filteredTotals} dataKey="0" emptyMessage="No categories found." rowClassName={rowClassName}>
                <Column header={selectAllRadioButton} body={radioButtonBodyTemplate} style={{ width: '4rem' }} />
                <Column field="0" header="Category" body={(rowData) => rowData[0]} sortable />
                <Column field="1.total" header="Total" body={(rowData) => `¥${rowData[1].total.toLocaleString()}`} sortable />
                <Column header="Action" body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
}

export default CategoryTotal;