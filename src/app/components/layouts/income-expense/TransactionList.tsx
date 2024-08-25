import { FC, useState } from 'react';
import { Transaction } from '@/app/components/layouts/income-expense/transactions';
import { supabase } from '@/app/lib/supabaseClient';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
	onDelete: (id: number) => void;
}

const TransactionList: FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

	const updateTransactionInDatabase = async (transaction: Transaction) => {
		const { error } = await supabase
			.from('transactions')
			.update({
				amount: transaction.amount,
				type: transaction.type,
				category: transaction.category,
				note: transaction.note,
				date: transaction.date,
			})
			.eq('id', transaction.id);
	
		if (error) {
			console.error('Error updating transaction:', error);
		}
	};
	

  const handleSaveEdit = async (updatedTransaction: Transaction) => {
		
    // 更新処理をサーバーに送信する例
    await updateTransactionInDatabase(updatedTransaction);

    onEdit(updatedTransaction);
    handleCancelEdit();
  };

	const deleteTransactionFormDatabase = async (id: number) => {
		const { error } = await supabase
			.from('transactions')
			.delete()
			.eq('id', id);

			if(error) {
				console.error('Error deleting transaction:', error);
			}
	};

	const handleDelete = async (id: number) => {
		await deleteTransactionFormDatabase(id);
		onDelete(id);
	}

  return (
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
        <th className="border px-4 py-3 text-left">Amount</th>
        <th className="border px-4 py-3 text-left">Type</th>
        <th className="border px-4 py-3 text-left">Category</th>
        <th className="border px-4 py-3 text-left">Note</th>
        <th className="border px-4 py-3 text-left">Date</th>
        <th className="border px-4 py-3 text-left">Actions</th>
      </tr>
    </thead>
    <tbody className="text-gray-600 text-sm">
      {transactions.map((transaction) => (
        <tr key={transaction.id} className="border-b hover:bg-gray-100">
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="number"
                value={editingTransaction.amount}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.amount}</span>
            )}
          </td>
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <select
                value={editingTransaction.type}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              >
                <option value="income">収入</option>
                <option value="expense">支出</option>
              </select>
            ) : (
              <span>{transaction.type}</span>
            )}
          </td>
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="text"
                value={editingTransaction.category}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.category}</span>
            )}
          </td>
          <td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="text"
                value={editingTransaction.note}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, note: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.note}</span>
            )}
          </td>
					<td className="border px-4 py-3">
            {editingTransaction?.id === transaction.id ? (
              <input
                type="text"
                value={editingTransaction.date}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                className="w-full px-2 py-1 border rounded-md"
              />
            ) : (
              <span>{transaction.date}</span>
            )}
          </td>
          <td className="border px-4 py-3 flex items-center">
            {editingTransaction?.id === transaction.id ? (
              <>
                <button
                  onClick={() => handleSaveEdit(editingTransaction)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(transaction)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default TransactionList;
