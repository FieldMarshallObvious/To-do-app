import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ChartComponent({ tasks, title, tasksComplete, tasksRemaining }) {
  const data = tasks.map((task, index) => ({
    name: task.name,
    complete: task.completedTasks,
    remaining: tasksRemaining[index], // Assume tasksRemaining is an array
  }));

  return (
    <div>
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
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