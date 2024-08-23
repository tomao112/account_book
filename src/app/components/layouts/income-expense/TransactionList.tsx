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
    <div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Note</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="border px-4 py-2">
                {editingTransaction?.id === transaction.id ? (
                  <input
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                  />
                ) : (
                  transaction.amount
                )}
              </td>
              <td className="border px-4 py-2">
                {editingTransaction?.id === transaction.id ? (
                  <select
                    value={editingTransaction.type}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value })}
                  >
                    <option value="income">収入</option>
                    <option value="expense">支出</option>
                  </select>
                ) : (
                  transaction.type
                )}
              </td>
              <td className="border px-4 py-2">
                {editingTransaction?.id === transaction.id ? (
                  <input
                    type="text"
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                  />
                ) : (
                  transaction.category
                )}
              </td>
              <td className="border px-4 py-2">
                {editingTransaction?.id === transaction.id ? (
                  <input
                    type="text"
                    value={editingTransaction.note}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, note: e.target.value })}
                  />
                ) : (
                  transaction.note
                )}
              </td>
              <td className="border px-4 py-2">
                {editingTransaction?.id === transaction.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(editingTransaction)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
									<>
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
									<button
                    onClick={() => handleDelete(transaction.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
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
