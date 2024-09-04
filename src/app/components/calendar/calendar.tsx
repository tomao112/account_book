import { useState, useEffect } from 'react';
import TransactionForm from '@/app/components/layouts/income-expense/TransactionForm';
import { Transaction } from '../layouts/income-expense/transactions';


interface CalendarProps {
  selectedMonth: Date;
  transactions: Transaction[];
  onEdit: (updateTransaction: Transaction) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onDateSelect: (date: Date) => void;
}


const Calendar: React.FC<CalendarProps> = ({ selectedMonth, transactions, onEdit, onDelete, onDateSelect}) => {
  // const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // const [days, setDays] = useState<Date[]>([]);
  const [ calendarDays, setCalendarDays ] = useState<Date[]>([]);
  const [ selectedDate, setSelectedDate ] = useState<Date | null>(null);
  const [ calendarTransactions, setCalendarTransactions ] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const days = generateCalendar(selectedMonth);
    setCalendarDays(days);
  }, [selectedMonth]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

  for(let i = firstDay.getDay(); i > 0; i--) {
    days.push(new Date(year, month, 1 - i));
  }

  for(let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  while (days.length < 42) {
    days.push(new Date(year, month + 1, days.length - lastDay.getDate()));
  }

  return days;
};
  const renderCalendar = () => {
    return (
    <div className='grid grid-cols-7 gap-1'>
      {[ '日', '月', '火', '水', '木', '金', '土', ].map(day => (
        <div key={day} className="text-center font-bold">{day}</div>
      ))}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={`p-2 border ${day.getMonth() !== selectedMonth.getMonth() ? 'bg-gray-100' : ''}`}
          onClick={() => onDateSelect(day)}
          >
          <div className="text-sm">{day.getDate()}</div>
          {rendarTransactionForDay(day)}
        </div>
    ))}
  </div>
  );
};

const rendarTransactionForDay = (day: Date) => {
  const dayTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return  tDate.getFullYear() === day.getFullYear() &&
            tDate.getMonth() === day.getMonth() &&
            tDate.getDate() === day.getDate();
  });

  return dayTransactions.map(transactions => (
    <div key={transactions.id} className="text-xs">
      {transactions.amount}円 ({transactions.category})
      <button onClick={(e) => {
        e.stopPropagation();
        onEdit(transactions);
      }} className="ml-1 text-blue-500">編集</button>
      <button onClick={(e) => {
        e.stopPropagation();
        onDelete(transactions.id)
      }} className="ml-1 text-red-500">削除</button>
    </div>
  ));
};

return (
  <div>
    <h2 className="text-xl">
    {selectedMonth.getFullYear()}年{selectedMonth.getMonth() + 1}月
    </h2>
    {renderCalendar()}
  </div>
);
};

export default Calendar;
