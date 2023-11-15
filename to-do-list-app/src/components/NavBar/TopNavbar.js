import React, { useState, useEffect } from "react";
import Settings from '../Settings/Settings.js';
import styles from './TopNavbar.module.css'; 
import settingsIcon from './settings-icon.svg';
import PropTypes from "prop-types"; // Import PropTypes
import { useUser } from "../../contexts/UserContext.js";
import numericFormatDate  from "../../utils/numericFormatDate.js";

export const TopNavbar = () => {

  const { nearestTask } = useUser();
  
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  const toggleSettings = () => {
    setSettingsVisible(prev => !prev);
  };



  return (
    <>
      <nav className={styles.TopNavbar}>
        <div className={styles.TaskInfo}>
          { 
            nearestTask ? 
            <>
              <span>Task Name: {nearestTask.name} </span>
              <span>Due Date: {numericFormatDate(nearestTask.due_date)}</span>
            </>
            :
            <span>Loading...</span>
          }
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
