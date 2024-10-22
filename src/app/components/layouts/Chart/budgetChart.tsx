// src/app/components/layouts/BudgetPage.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { supabase } from '@/app/lib/supabaseClient';

interface Budget {
    id: number;
    category: string;
    amount: number;
}

interface Expense {
    category: string;
    amount: number;
}

const BudgetPage: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [budgetInput, setBudgetInput] = useState<{ category: string; amount: number }>({ category: '', amount: 0 });
    const [expenseInput, setExpenseInput] = useState<{ category: string; amount: number }>({ category: '', amount: 0 });
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const { data, error } = await supabase.from('budgets').select('*');
            if (error) throw error;
            if (data) {
                setBudgets(data as Budget[]);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching budgets:', error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'category' | 'amount') => {
        setBudgetInput({ ...budgetInput, [field]: field === 'amount' ? Number(e.target.value) : e.target.value });
    };

    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'category' | 'amount') => {
        setExpenseInput({ ...expenseInput, [field]: field === 'amount' ? Number(e.target.value) : e.target.value });
    };

    const addBudget = async () => {
        if (budgetInput.category && budgetInput.amount > 0) {
            try {
                const { data, error } = await supabase.from('budgets').insert([{ category: budgetInput.category, amount: budgetInput.amount }]);
                if (error) throw error;
                if (data && (data as Budget[]).length > 0) { // 型アサーションを使用
                    setBudgets([...budgets, { id: (data[0] as Budget).id, ...budgetInput }]);
                    setBudgetInput({ category: '', amount: 0 });
                    toast.current?.show({ severity: 'success', summary: 'Budget Added', detail: `Added budget for ${budgetInput.category}: ${budgetInput.amount}` });
                }
            } catch (error) {
                console.error('Error adding budget:', error);
            }
        }
    };

    const addExpense = () => {
        if (expenseInput.category && expenseInput.amount > 0) {
            setExpenses([...expenses, expenseInput]);
            setExpenseInput({ category: '', amount: 0 });
            toast.current?.show({ severity: 'success', summary: 'Expense Added', detail: `Added expense for ${expenseInput.category}: ${expenseInput.amount}` });
        }
    };

    const getRemainingBudget = (category: string) => {
        const budget = budgets.find(b => b.category === category);
        const totalExpenses = expenses.filter(e => e.category === category).reduce((acc, curr) => acc + curr.amount, 0);
        return budget ? budget.amount - totalExpenses : 0; // budgetがundefinedの場合は0を返す
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2>予算設定</h2>
            <div className="flex flex-column gap-2">
                <InputText 
                    value={budgetInput.category} 
                    onChange={(e) => handleBudgetChange(e, 'category')} 
                    placeholder="カテゴリーを設定" 
                />
                <InputText 
                    type="number" 
                    value={budgetInput.amount.toString()} 
                    onChange={(e) => handleBudgetChange(e, 'amount')} 
                    placeholder="予算を設定" 
                />
                <Button label="予算を追加" onClick={addBudget} />
            </div>

            <h2 className="mt-4">支出管理</h2>
            <div className="flex flex-column gap-2">
                <InputText 
                    value={expenseInput.category} 
                    onChange={(e) => handleExpenseChange(e, 'category')} 
                    placeholder="カテゴリーを選択" 
                />
                <InputText 
                    type="number" 
                    value={expenseInput.amount.toString()} 
                    onChange={(e) => handleExpenseChange(e, 'amount')} 
                    placeholder="支出を入力" 
                />
                <Button label="支出を追加" onClick={addExpense} />
            </div>

            <h2 className="mt-4">予算の残り</h2>
            {budgets.map((budget) => (
                <div key={budget.id} className="mt-2">
                    <h3>{budget.category}</h3>
                    <ProgressBar value={(getRemainingBudget(budget.category) / budget.amount) * 100} />
                    <p>残りの予算: {getRemainingBudget(budget.category)} / {budget.amount}</p>
                </div>
            ))}
        </div>
    );
};

export default BudgetPage;