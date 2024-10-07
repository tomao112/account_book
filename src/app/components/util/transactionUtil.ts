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

export function calculateMonthlySummaryAndCategoryTotals(transactions: Transaction[], selectedMonth: Date) {
    const categoryTotals: { [key: string]: { total: number; type: string } } = {};
    let summary = { income: 0, expense: 0, deposit: 0 };

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        console.log('Processing Transaction:', transaction);
        if (transactionDate.getFullYear() === selectedMonth.getFullYear() && transactionDate.getMonth() === selectedMonth.getMonth()) {
            if (transaction.type === 'income') {
                summary.income += transaction.amount;
                if (categoryTotals[transaction.category]) {
                    categoryTotals[transaction.category].total += transaction.amount;
                } else {
                    categoryTotals[transaction.category] = { total: transaction.amount, type: 'income' };
                }
            } else if (transaction.type === 'expense') {
                summary.expense += transaction.amount;
                if (categoryTotals[transaction.category]) {
                    categoryTotals[transaction.category].total += transaction.amount;
                } else {
                    categoryTotals[transaction.category] = { total: transaction.amount, type: 'expense' };
                }
            } else if (transaction.type === 'deposit') {
                summary.deposit += transaction.amount;
                if (categoryTotals[transaction.category]) {
                    categoryTotals[transaction.category].total += transaction.amount;
                } else {
                    categoryTotals[transaction.category] = { total: transaction.amount, type: 'deposit' };
                }
            }
        }
    });
    console.log(summary);
    return { summary, totals: categoryTotals };

}