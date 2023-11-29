import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getComplementaryColor } from '../../utils/colorUtils';

function ChartComponent({ tasks, title,tasksRemaining, seperateProjects = true }) {

  // Process the current completed state of tasksa
  const processData = (projects) => {
    if (!projects) {
      return [];
    }

    return projects.map(project => {
      let completedTasks = 0;
      let remainingTasks = 0;
      if (project.Tasks && Array.isArray(project.Tasks) && project.Tasks.length !== 0) {
        completedTasks = project.Tasks.filter(task => task.completed).length;
        remainingTasks = project.Tasks.length - completedTasks;
      }

      return {
        name: project.Title,
        [ seperateProjects ? `complete ${project.Title}` : `complete`]: completedTasks,
        [ seperateProjects ? `remaining ${project.Title}` : `remaining`]: remainingTasks,
      };
    });
  };

  const [data, setData] = useState([]);

  const [containerSize, setContainerSize] = useState({ width: '100%', height: '100%' }); // Default size
  const containerRef = useRef(null);

  // Load the tasks whenever the tasks prop changes
  useEffect(() => {
    if (tasks) {
      setData(processData(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        setContainerSize({ width: newWidth, height: newHeight });
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', resizeHandler);

    // Initial size calculation
    resizeHandler();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <h2>{title}</h2>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {
            !seperateProjects ?
            <>
              <Bar dataKey="complete" fill="#8884d8" name="Tasks Complete" />
              <Bar dataKey="remaining" fill="#82ca9d" name="Tasks Remaining" />
            </>
            :
            <>
              {tasks.map(project => (
                <>
                <Bar name="Tasks Complete" key={`complete ${project.Title}`} dataKey={`complete ${project.Title}`} fill={ project.Color ? project.Color : "#8884d8"} />

                <Bar name="Tasks Remaining" key={`remaining ${project.Title}`}  dataKey={`remaining ${project.Title}`} fill={ project.Color ? getComplementaryColor(project.Color) : "#82ca9d" } />
                </>
              ))}
            </>
          }
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;