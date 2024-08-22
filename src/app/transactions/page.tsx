// "use client";
// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabaseClient';

// interface Transaction {
//   id: string;
//   user_id: string;
//   amount: number;
//   category: string;
//   type: string;
//   date: string;
//   note: string;
// }

// // ユーザーIDを取得するためのカスタムフック
// const useUser = () => {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data } = await supabase.auth.getUser();
//       setUser(data.user);
//     };

//     fetchUser();
//   }, []);

//   return user;
// };

// const TransactionsPage = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 取引を取得する関数
//   const fetchTransactions = async () => {
//     const { data, error } = await supabase
//       .from('transactions')
//       .select('*')
//       .order('date', { ascending: false });

//     if (error) console.error('Error fetching transactions:', error.message);
//     else setTransactions(data || []);

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Transactions</h1>
//       <TransactionForm onNewTransaction={fetchTransactions} />
//       <ul>
//         {transactions.map((transaction) => (
//           <li key={transaction.id}>
//             <p>Type: {transaction.type}</p>
//             <p>Amount: ${transaction.amount}</p>
//             <p>Category: {transaction.category}</p>
//             <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
//             <p>Note: {transaction.note}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const TransactionForm = ({ onNewTransaction }: { onNewTransaction: () => void }) => {
//   const [amount, setAmount] = useState('');
//   const [category, setCategory] = useState('');
//   const [type, setType] = useState('income');
//   const [date, setDate] = useState('');
//   const [note, setNote] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const { error } = await supabase
//       .from('transactions')
//       .insert([{ amount, category, type, date, note }]);

//     if (error) {
//       console.error('Error adding transaction:', error.message);
//     } else {
//       setAmount('');
//       setCategory('');
//       setType('income');
//       setDate('');
//       setNote('');
//       onNewTransaction(); // 新しい取引が追加された後にリストを更新
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Amount"
//         required
//       />
//       <input
//         type="text"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         placeholder="Category"
//         required
//       />
//       <select value={type} onChange={(e) => setType(e.target.value)}>
//         <option value="income">Income</option>
//         <option value="expense">Expense</option>
//       </select>
//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         required
//       />
//       <input
//         type="text"
//         value={note}
//         onChange={(e) => setNote(e.target.value)}
//         placeholder="Note"
//       />
//       <button type="submit">Add Transaction</button>
//     </form>
//   );
// };

// export default TransactionsPage;
