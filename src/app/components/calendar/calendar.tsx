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

  // 前の月の日付を追加
  const prevMonthLastDay = new Date(year, month, 0); // 前の月の最終日
  for (let i = firstDay.getDay(); i > 0; i--) {
    days.push(new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i + 1));
  }

  // 今月の日付を追加
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // 次の月の日付を追加
  const nextMonthDaysNeeded = 35 - days.length; // 6週分の35日
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    days.push(new Date(year, month + 1, i));
  }

    return days;
  };

  const calculateDayTotal = (day: Date, transactions: Transaction[]) => {
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return  tDate.getFullYear() === day.getFullYear() &&
              tDate.getMonth() === day.getMonth() &&
              tDate.getDate() === day.getDate();
    });

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);

    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);

    const deposit = dayTransactions
      .filter(t => t.type === 'deposit')
      .reduce((total, t) => total + t.amount, 0) ;

    const total = income - expense;

    return { income, expense, deposit, total, dayTransactions };

    // return dayTransactions.reduce((total, t) => {
    //   return total + (t.type === 'income' ? t.amount : -t.amount);
    // }, 0);
  };

  const renderCalendar = () => {
    const days = generateCalendarDays(selectedMonth);
    return (
        <div className="grid grid-cols-7 pr-10 pl-10 pb-10">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={index} className={`text-center border p-1 ${day === '土' ? 'text-blue-500' : day === '日' ? 'text-red-500' : 'text-black'}`}>
            {day}
          </div>
          ))}
          {days.map((day, index) => {
            const isSaturday = day.getDay() === 6; // 土曜日
            const isSunday = day.getDay() === 0; // 日曜日
            const dayClass = isSaturday ? 'text-blue-500' : isSunday ? 'text-red-500' : 'text-black';
          
            const { income, expense, deposit, total, dayTransactions } = calculateDayTotal(day, transactions);
            // const dayTotal = calculateDayTotal(day, transactions);
          
            return (
              <div
                key={index}
                className={` ${index === 28 ? 'rounded-bl-lg' : ''} ${index === 34 ? 'rounded-br-lg' : ''} p-2 border aspect-video ${dayClass} ${day.getMonth() !== selectedMonth.getMonth() ? 'bg-gray-100' : ''} cursor-pointer`}
                onClick={() => onDateClick(day, dayTransactions)}
              >
                <div className="text-sm">{day.getDate()}</div>
                {income > 0 ? (
                  <div className="text-sm text-muted-green">¥{income.toLocaleString()}</div>
                ) : (
                  <div className="text-sm">&nbsp;</div>
                )}
                {expense > 0 ? (
                  <div className="text-sm text-muted-red">¥{expense.toLocaleString()}</div>
                ) : (
                  <div className="text-sm">&nbsp;</div>
                )}
                {deposit > 0 ? (
                  <div className="text-sm text-muted-blue">¥{deposit.toLocaleString()}</div>
                ) : (
                  <div className="text-sm">&nbsp;</div>
                )}
                {/* {total !== 0 && (
                  <div className={`text-sm text- ${total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ¥{total.toLocaleString()}
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
    );
  };

  return (
    <div>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;