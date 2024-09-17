import React from "react";
import { Transaction } from "./transactions";

interface TransactionModelProps {
	isOpen: boolean;
	onClose: () => void;
	onAddNew: () => void;
	onEdit: (transaction: Transaction) => void;
	date: Date | null;
	transactions: Transaction[];
}

const TransactionModel: React.FC<TransactionModelProps> = ({
	isOpen,
	onClose,
	onAddNew,
	onEdit,
	date,
	transactions
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
			<div className="bg-gray-100 p-6 z-60 w-1/4">
				<h2 className="text-xl mb-4">
					{date?.toLocaleDateString()}
				</h2>
				<div className="flex items-center justify-around mb-3">
					<button onClick={onAddNew} className="bg-green-400 text-white px-4 py-2 rounded-full">
						+ 内訳
					</button>
					<button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-full">
						閉じる
					</button>
					{/* メモ機能追加予定 */}
					<button onClick={onClose} className="bg-yellow-500 text-white px-4 py-2 rounded-full">
						+メモ
					</button>
				</div>
				<div className="bg-white text-sm flex justify-between p-5 w-full rounded-lg mb-10">
					<p className="">収入</p>
					<p className="">支出</p>
					</div>
				{transactions.map(t => (
					<div key={t.id} className="mb-2">
						<button onClick={() => onEdit(t)} className="bg-white text-sm flex justify-between p-5 w-full rounded-lg">
							<span>{t.category.length > 5 ? `${t.category.slice(0, 20)}...` : t.category}</span>
							<span>{t.amount}円</span>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default TransactionModel;