import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  const tasks = [
    { name: 'Task 1', startDate: new Date(2023, 10, 1), endDate: new Date(2023, 10, 3) },
    { name: 'Task 2', startDate: new Date(2023, 10, 5), endDate: new Date(2023, 10, 6) },
    // Add more tasks
  ];

  const events = tasks.map(task => ({
    title: task.name,
    start: task.startDate,
    end: task.endDate,
  }));

  return (
    <div>
      <h2>Calendar with Tasks</h2>
      <Calendar value={date} onChange={setDate} events={events} />
    </div>
  );
}

export default CalendarWidget;