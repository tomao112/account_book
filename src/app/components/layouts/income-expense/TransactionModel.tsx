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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg z-60">
				<h2 className="text-xl font-bold mb-4">
					{date?.toLocaleDateString()}の取引
				</h2>
				{transactions.map(t => (
					<div key={t.id} className="mb-2">
						{t.amount}円 ({t.category.length > 5 ? `${t.category.slice(0, 20)}...` : t.category}) - {t.type === 'expense' ? '支出' : '収入'}
						<div>
							<button onClick={() => onEdit(t)} className="bg-yellow-500 text-white px-4 py-2 rounded">
								編集
							</button>
						</div>
					</div>
				))}
				<div className="mt-4 flex justify-end">
					<button onClick={onAddNew} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
						新規追加
					</button>

					<button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
						閉じる
					</button>
				</div>
			</div>
		</div>
	);
};

export default TransactionModel;