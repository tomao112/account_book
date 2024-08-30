import { useState, useEffect } from 'react';
import TransactionForm from '@/app/components/layouts/income-expense/TransactionForm';
import { supabase } from '@/app/lib/supabaseClient';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    generateCalendar(currentDate);
    fetchTransactions();
  }, [currentDate]);

  const generateCalendar = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysArray: Date[] = [];

    for (let i = start.getDay(); i > 0; i--) {
      const day = new Date(start);
      day.setDate(start.getDate() - i);
      daysArray.push(day);
    }

    for (let i = 1; i <= end.getDate(); i++) {
      daysArray.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    for (let i = end.getDay(); i < 6; i++) {
      const day = new Date(end);
      day.setDate(end.getDate() + (i - end.getDay() + 1));
      daysArray.push(day);
    }

    setDays(daysArray);
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true });

      if(error) {
        console.error('Error fetching transactions:', error);
      } else {
        const transactionsMap = new Map<string, number>();
        data.forEach((transaction: { date: string; amount: number }) => {
          transactionsMap.set(transaction.date, transaction.amount);
        });
        setTransactions(transactionsMap);
      }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (transaction: {
    amount: string;
    type: string;
    category: string;
    note: string;
    date: string;
  }) => {
    const { error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        date: transaction.date
      }]);

      if(error) {
        console.error('Error adding transaction:', error);
      } else {
        setTransactions(new Map(transactions.set(transaction.date, parseFloat(transaction.amount))));
        setSelectedDate(null);
      }
  };

  return (
    <div>
      <header>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>Previous</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>Next</button>
      </header>
      <div className="calendar-grid">
        {days.map((day, index) => {
          const dayStr = day.toLocaleDateString('en-CA');
          return (
            <div
            key={index}
            className="calendar-day"
            onClick={() => handleDateClick(day)}
          >
            <div>{day.getDate()}</div>
            <div>{transactions.get(dayStr) ? `${transactions.get(dayStr)}円` : ''}</div>
          </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="note-input">
          <TransactionForm selectedDate={selectedDate} onSubmit={handleSubmit} />
        </div>
      )}
      <style jsx>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .calendar-day {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
          cursor: pointer;
        }
        .calendar-day:hover {
          background-color: #f0f0f0;
        }
        .note-input {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
