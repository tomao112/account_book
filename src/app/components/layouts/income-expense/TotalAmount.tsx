import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Transaction } from "./transactions";

interface MonthlySummaryProps {
	selectedMonth: Date;
	transactions: Transaction[];
}

const TotalAmount: React.FC<MonthlySummaryProps> = ({ selectedMonth, transactions }) => {
	const [ income, setIncome ] = useState(0);
	const [ expense, setExpense ] = useState(0);

	const fetchMonthlySummary = async () => {
		const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
		const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

		const { data: transactions, error } = await supabase
			.from('transactions')
			.select('*')
			.gte('date', startDate.toISOString())
			.lte('date', endDate.toISOString());

			if(error) {
				console.log('Error fetching transactions:', error);
				return;
			}

			let totalIncome = 0;
			let totalExpense = 0;

			transactions?.forEach((transaction) => {
				if(transaction.type === 'income') {
					totalIncome += parseFloat(transaction.amount);
				} else if(transaction.type === 'expense') {
					totalExpense += parseFloat(transaction.amount);
				}
			});

			setIncome(totalIncome);
			setExpense(totalExpense);
			// console.log('Fetched Transactions:', transactions);
			// console.log('Total Income:', totalIncome);
			// console.log('Total Expense:', totalExpense);
	};

	useEffect(() => {
		fetchMonthlySummary();

		const subscription = supabase
			.channel('public:transactions')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
				// console.log('Change received!', payload);
				fetchMonthlySummary();
			})
			.subscribe();

			return () => {
				supabase.removeChannel(subscription);
			};
	}, [selectedMonth, transactions]);

	return (
		<div className="monthly-summary">
			<h2 className="text-xl font-bold">Monthly Summary for {selectedMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric' })}</h2>
			<div className="mt-4">
				<p className="text-green-600">Total income: {income.toLocaleString()}</p>
				<p className="text-red-600">Total Expense: {expense.toLocaleString()}</p>
				<p className="text-blue-600">Net Balance: {(income - expense).toLocaleString()}</p>
			</div>
		</div>
	)
}

export default TotalAmount;