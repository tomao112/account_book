import React, { useState, useEffect } from 'react';
import { Transaction } from '../layouts/income-expense/transactions';

interface CalendarProps {
  selectedMonth: Date;
  transactions: Transaction[];
  onDateClick: (date: Date, dayTransactions: Transaction[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedMonth, transactions, onDateClick }) => {
  const [ isPopupOpen, setIsPopupOpen ] = useState(false);
  const [ selectedDate, setSelectedDate ] = useState<Date | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsPopupOpen(true);
  }
  // const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // useEffect(() => {
  //   const days = generateCalendarDays(selectedMonth);
  //   setCalendarDays(days);
  // }, [selectedMonth]);

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let i = firstDay.getDay(); i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    while (days.length < 42) {
      days.push(new Date(year, month + 1, days.length - lastDay.getDate()));
    }

    return days;
  };

  const calculateDayTotal = (day: Date): number => {
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return  tDate.getFullYear() === day.getFullYear() &&
              tDate.getMonth() === day.getMonth() &&
              tDate.getDate() === day.getDate();
    });

    return dayTransactions.reduce((total, t) => {
      return total + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  };

  const renderCalendar = () => {
    const days = generateCalendarDays(selectedMonth);
    return (
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {days.map((day, index) => {
          const dayTotal = calculateDayTotal(day);
          const dayTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return  tDate.getFullYear() === day.getFullYear() &&
                    tDate.getMonth() === day.getMonth() &&
                    tDate.getDate() === day.getDate();
          });

          return (
            <div
              key={index}
              className={`p-2 border ${day.getMonth() !== selectedMonth.getMonth() ? 'bg-gray-100' : ''} cursor-pointer`}
              onClick={() => onDateClick(day, dayTransactions)}
            >
              <div className="text-sm">{day.getDate()}</div>
              <div className={`text-sm ${dayTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dayTotal.toLocaleString()}円
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {/* {selectedMonth.getFullYear()}年{selectedMonth.getMonth() + 1}月 */}
      </h2>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;