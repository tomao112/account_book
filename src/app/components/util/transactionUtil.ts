// account_book/src/app/components/util/transactionUtil.ts
import { Transaction } from '@/app/components/layouts/income-expense/transactions';

export const calculateMonthSummary = (filteredTransactions: Transaction[]) => {
    const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const deposit = filteredTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, deposit };
};

export const getFilterTransactions = (transactions: Transaction[], selectedMonth: Date) => {
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
            transactionDate.getFullYear() === selectedMonth.getFullYear() &&
            transactionDate.getMonth() === selectedMonth.getMonth()
        );
    });
};

export const calculateMonthlyCategoryTotals = (transactions: Transaction[]) => {
    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach(transaction => {
        const category = transaction.category; // カテゴリーを取得
        const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += amount;
    });

    return categoryTotals;
};

// 新しい関数を追加
export const calculateMonthlySummaryAndCategoryTotals = (transactions: Transaction[], selectedMonth: Date) => {
    const filteredTransactions = getFilterTransactions(transactions, selectedMonth);
    const summary = calculateMonthSummary(filteredTransactions);
    const totals = calculateMonthlyCategoryTotals(filteredTransactions);
    return { summary, totals };
};