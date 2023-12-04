import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../TaskChart/CalendarWidget.css';
import YearMonthDateFormat  from '../../utils/YearMonthDateFormat';

function normalizeDate(date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

function sameDay(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function CalendarWidget(projects) {
  const [date, setDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const [tasks, setTasks] = useState([]);

  const tileContent = ({ date }) => {
    let normalizeSelectedDate = normalizeDate(new Date(date));

    // Filter out all values except for those that are on the same day as the date
    const dueTasks = tasks.flat().filter(task => 
      sameDay(normalizeSelectedDate, task.startDate));
    if (dueTasks.length > 0) {
      return  <div className='circle-container'> 
                    <div className={`base-circle`} style={{background: dueTasks[0].color}}></div>
              </div>;
    } else {
      return <div>
                <div className='circle-container'> 
                    <div className={`base-circle`} style={{background: 'white', opacity: 0}}></div>
                </div>
      </div>
    }
  };

  const handleDateClick = date => {
    const dueTasks = tasks.flat().filter(task => date >= task.startDate && date <= task.endDate);
    setSelectedTasks(dueTasks);
  };

  const processProjects = ({projects}) => {
    if (!projects) {
      return [];
    }

    const tasks = projects.filter(project => project.Tasks && Array.isArray(project.Tasks) && project.Tasks.length > 0).flat(1).map(project => {
      return project.Tasks.map(task => {
        return {
          name: task.name,
          startDate: normalizeDate(new Date( new Date(YearMonthDateFormat(task.due_date)).getTime() + (24 * 60 * 60 * 1000))),
          endDate: normalizeDate(new Date(new Date(YearMonthDateFormat(task.due_date)).getTime() + (24 * 60 * 60 * 1000))),
          color: project.Color ? project.Color : 'blue',
        };
      });
    });

    return tasks;

  }

  useEffect(() => {
    if (projects) {
      const tasks = processProjects(projects);
      setTasks(tasks);
    }
  }, [projects]);

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