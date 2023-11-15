import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);

  const tasks = [
    { name: 'Task 1', startDate: new Date(2023, 10, 1), endDate: new Date(2023, 10, 3) },
    { name: 'Task 2', startDate: new Date(2023, 10, 5), endDate: new Date(2023, 10, 6) },
    // Add more tasks
  ];

  const tileContent = ({ date }) => {
    const isDueDate = tasks.some(task => date >= task.startDate && date <= task.endDate);
    return isDueDate ? <div className="red-circle"></div> : null;
  };

  const handleDateClick = date => {
    const dueTasks = tasks.filter(task => date >= task.startDate && date <= task.endDate);
    setSelectedTasks(dueTasks);
  };

  return (
    <div>
      <Calendar value={date} onChange={setDate} onClickDay={handleDateClick} tileContent={tileContent} />
      {selectedTasks.length > 0 && (
        <div>
          <h3>Tasks Due on {selectedTasks[0].startDate.toLocaleDateString()}</h3>
          <ul>
            {selectedTasks.map(task => (
              <li key={task.name}>{task.name}</li>
            ))}
          </ul>
        </div>
      )}
      <style>
        {`
          .react-calendar__tile--has-tasks {
            background-color: red;
            border-radius: 50%;
          }

          .red-circle {
            width: 10px;
            height: 10px;
            background-color: red; 
            border-radius: 50%;
            margin-left: 12px;
          }
        `}
      </style>
    </div>
  );
}

export default CalendarWidget;