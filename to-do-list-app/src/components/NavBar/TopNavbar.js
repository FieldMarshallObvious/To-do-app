import React, { useState, useEffect } from "react";
import Settings from '../Settings/Settings.js';
import styles from './TopNavbar.module.css'; 
import settingsIcon from './settings-icon.svg';
import PropTypes from "prop-types"; // Import PropTypes

export const TopNavbar = ({ initialTask }) => {
  
  const [task, setTask] = useState(initialTask);
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  const toggleSettings = () => {
    setSettingsVisible(prev => !prev);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : "No due date";
  };

  useEffect(() => {
    const taskUpdateInterval = setInterval(() => {
      // Just checking that the task can update
      setTask({
        name: "Updated Task ",
        due_date: new Date(),
      });
    }, 5000);

    return () => clearInterval(taskUpdateInterval);
  }, []);


  return (
    <>
      <nav className={styles.TopNavbar}>
        <div className={styles.TaskInfo}>
          <span>Task Name: {task.name}</span>
          <span>Due Date: {formatDate(task.due_date)}</span>
        </div>

        <div className={styles.Spacer} />

        <div className={styles.SettingsIconContainer} onClick={toggleSettings}>
        <img 
          src={settingsIcon} 
          alt="Settings Icon" 
          className={styles.SettingsIcon}
        />
        </div>
      </nav>

      {isSettingsVisible && (
            <Settings />  
      )}
    </>
  );
  };

  TopNavbar.propTypes = {
    initialTask: PropTypes.shape({
      name: PropTypes.string.isRequired,
      due_date: PropTypes.instanceOf(Date).isRequired,
    }),
  };

  export default TopNavbar;
