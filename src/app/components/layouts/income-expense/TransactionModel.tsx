import React, { useEffect, useState } from "react";
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
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // アニメーション状態を追加

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsAnimating(true); // 開いたときにアニメーションを開始
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsAnimating(false); // アニメーションが終わったら状態をリセット
      }, 500); // アニメーションの時間に合わせて遅延を設定
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // スライドアウトアニメーションが終わった後にonCloseを呼び出す
    }, 500); // アニメーションの時間に合わせて遅延を設定
  };

	if (!isOpen) return null;

	  // 選択した日付の収入と支出を計算
		const selectedDateString = date ? date.toLocaleDateString('en-CA') : '';
		const income = transactions
			.filter(t => t.date === selectedDateString && t.type === 'income')
			.reduce((sum, t) => sum + t.amount, 0);
	
		const expense = transactions
			.filter(t => t.date === selectedDateString && t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0);

	return (
		<div className={`${isClosing ? '-z-10 hidden' : 'z-50 fixed inset-0 text-gray-500 bg-black bg-opacity-50 flex justify-end'}`}>
			<div className={`bg-neutral-100 p-6 z-60 w-2/5 slide-in ${isClosing ? 'slide-out-active' : 'slide-in-active'}`}>
				<h2 className="text-base text-center">
						{date ? date.getMonth() + 1 : ''}月{date?.getDate()}日(〇)
				</h2>
					<button onClick={handleClose} className="text-2xl relative bottom-9 right-5 text-gray-500 px-4 py-2 rounded-full">
						×
					</button>
				<div className="flex items-center justify-around mb-3">
					<button onClick={onAddNew} className="bg-muted-green border-2 text-white px-4 py-2 rounded-full">
						+ 内訳
					</button>
					{/* メモ機能追加予定 */}
					{/* <button onClick={onClose} className="bg-muted-yellow border-2 text-white px-4 py-2 rounded-full">
						+メモ
					</button> */}
				</div>
				<div className="bg-white text-sm flex justify-between p-3 w-full rounded-lg mb-10">
					<p className="text-muted-green">収入:{income}</p>
					<p className="text-muted-red">支出:{expense}</p>
					</div>
				{transactions.map(t => (
					<div key={t.id} className="mb-2">
						<button onClick={() => onEdit(t)} className="bg-white text-sm flex justify-between p-5 w-full rounded-lg">
							<span>{t.category.length > 5 ? `${t.category.slice(0, 20)}...` : t.category}</span>
							<span className="">{t.amount}円</span>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default TransactionModel;