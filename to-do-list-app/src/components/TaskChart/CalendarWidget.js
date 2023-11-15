import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);

  const tasks = [
    { name: 'Task 1', startDate: new Date(2023, 10, 1), endDate: new Date(2023, 10, 3), color: 'blue' },
    { name: 'Task 2', startDate: new Date(2023, 10, 5), endDate: new Date(2023, 10, 6), color: 'green' },
    // Add more tasks
  ];

  const tileContent = ({ date }) => {
    const dueTasks = tasks.filter(task => date >= task.startDate && date <= task.endDate);

    if (dueTasks.length > 0) {
      const taskColor = dueTasks[0].color; // Assuming all tasks for a day have the same color
      return <div className={`red-circle ${taskColor}-circle`}></div>;
    }

    return null;
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

          .custom-calendar .react-calendar__tile {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .react-calendar__tile--has-tasks {
            border-radius: 50%;
          }

          .red-circle {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 12px;
          }

          .blue-circle {
            background-color: blue;
          }

          .green-circle {
            background-color: green;
          }
        `}
      </style>
    </div>
  );
}

export default CalendarWidget;