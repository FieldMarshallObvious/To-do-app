import React from 'react';
import { ListTask } from 'react-bootstrap-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ChartComponent = ({ task, title = "Tasks Completed / Time" }) => {
    const tasks = [
        { name: 'Task 1', completedTasks: 400 },
        { name: 'Task 2', completedTasks: 300 },
        { name: 'Task 3', completedTasks: 200 },
        { name: 'Task 4', completedTasks: 278 },
        { name: 'Task 5', completedTasks: 189 },
      ];

  return (
    <LineChart width={600} height={300} tasks={tasks}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default ChartComponent;