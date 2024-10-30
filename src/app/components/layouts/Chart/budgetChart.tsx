// // account_book/src/app/components/layouts/Budget/page.tsx

// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/app/lib/supabaseClient'; // Supabaseクライアントをインポート

// interface Budget {
//     category: string;
//     amount: number;
//     month: string;
// }

// const BudgetPage: React.FC = () => {
//     const [selectedCategory, setSelectedCategory] = useState<string>('');
//     const [budget, setBudget] = useState<number | ''>('');
//     const [currentMonth, setCurrentMonth] = useState<string>('');
//     const [budgets, setBudgets] = useState<Budget[]>([]);

//     useEffect(() => {
//         // 現在の月を取得して設定
//         const now = new Date();
//         const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
//         setCurrentMonth(month);
//     }, []);

//     const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedCategory(e.target.value);
//     };

//     const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setBudget(e.target.value ? parseFloat(e.target.value) : '');
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedCategory || budget === '') {
//             alert('カテゴリと予算を入力してください。');
//             return;
//         }

//         // 予算をデータベースに登録
//         const { data, error } = await supabase.from('budget').insert([
//             { category: selectedCategory, budget: budget } // フィールド名を確認
//         ]);

//         if (error) {
//             console.error('Error inserting budget:', error.message);
//             return;
//         }

//         // ローカルの予算リストに追加
//         setBudgets([...budgets, { category: selectedCategory, amount: budget as number, month: currentMonth }]);

//         // フォームをリセット
//         setSelectedCategory('');
//         setBudget('');
//     };

//     // カテゴリ配列
//     const categories = [
//         '食費',
//         '光熱費',
//         '娯楽',
//         '交通費',
//         'レジャー',
//         'スーパー/コンビニ',
//         'ファッション/美容',
//         '日用品',
//         '住居/通信',
//         '健康/教育',
//         'その他',
//     ];

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl mb-4">予算設定</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block text-gray-700">カテゴリ</label>
//                     <select
//                         value={selectedCategory}
//                         onChange={handleCategoryChange}
//                         className="mt-1 p-2 w-full border rounded-md"
//                         required
//                     >
//                         <option value="">選択してください</option>
//                         {categories.map((category) => (
//                             <option key={category} value={category}>
//                                 {category}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-gray-700">予算</label>
//                     <input
//                         type="number"
//                         value={budget}
//                         onChange={handleBudgetChange}
//                         className="mt-1 p-2 w-full border rounded-md"
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                     保存
//                 </button>
//             </form>

//             <div className="mt-6">
//                 <h2 className="text-xl mb-2">現在の月の予算</h2>
//                 <ul className="space-y-2">
//                     {budgets.map((budget, index) => (
//                         <li key={index} className="flex justify-between p-2 border rounded-md">
//                             <span>{budget.month} - {budget.category}</span>
//                             <span>¥{budget.amount.toLocaleString()}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default BudgetPage;