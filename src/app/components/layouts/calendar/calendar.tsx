import { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysArray: Date[] = [];

    // Fill in the previous month's days
    for (let i = start.getDay(); i > 0; i--) {
      const day = new Date(start);
      day.setDate(start.getDate() - i);
      daysArray.push(day);
    }

    // Fill in the current month's days
    for (let i = 1; i <= end.getDate(); i++) {
      daysArray.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    // Fill in the next month's days
    for (let i = end.getDay(); i < 6; i++) {
      const day = new Date(end);
      day.setDate(end.getDate() + (i - end.getDay() + 1));
      daysArray.push(day);
    }

    setDays(daysArray);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedDate) {
      setNotes({
        ...notes,
        [selectedDate.toDateString()]: e.target.value,
      });
    }
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div>
      <header>
        <button onClick={() => handleMonthChange(-1)}>Previous</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={() => handleMonthChange(1)}>Next</button>
      </header>
      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className="calendar-day"
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
      {selectedDate && (
        <div className="note-input">
          <h3>Notes for {selectedDate.toDateString()}</h3>
          <textarea
            value={notes[selectedDate.toDateString()] || ''}
            onChange={handleNoteChange}
          />
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
        textarea {
          width: 100%;
          height: 100px;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
