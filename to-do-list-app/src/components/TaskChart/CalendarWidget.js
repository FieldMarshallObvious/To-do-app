import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../TaskChart/CalendarWidget.css';

function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);

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

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight); /* Might remove this later. We'll see. */
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); /* Down to here */

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
    </div>
  );
}

export default CalendarWidget;