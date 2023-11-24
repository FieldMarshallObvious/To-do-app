import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ChartComponent({ tasks, title, tasksComplete, tasksRemaining }) {
  const data = tasks.map((task, index) => ({
    name: task.name,
    complete: task.completedTasks,
    remaining: tasksRemaining, // Integer variable of remaining tasks.
  }));

  const [containerSize, setContainerSize] = useState({ width: '100%', height: '100%' }); // Default size
  const containerRef = useRef(null);

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
          <Bar dataKey="complete" fill="#8884d8" name="Tasks Complete" />
          <Bar dataKey="remaining" fill="#82ca9d" name="Tasks Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;