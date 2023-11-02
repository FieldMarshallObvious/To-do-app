import React, { useState } from "react";
import { Link } from "react-router-dom";
import Settings from '../Settings.js';
import styles from './TopNavbar.css'; 
import settingsIcon from './image.svg';

const task = {
  due_date: new Date(),
  name: "Some name",
  color: "some color"
};

export const TopNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  return (
    <nav>
      <Link to="/settings" className={`${styles.TopNavbar}`}>Settings</Link>
      <div className={`${styles.TopNavbar}`} onClick={() => setMenuOpen(!menuOpen)}>
        <div>Task Name: {task.name} Due Date: {task.due_date.toString()}</div>
        <div>Task Color: {task.color}</div>
      </div>

      <div className={`${styles.TopNavbar}`} style={{ position: "fixed", top: "15px", right: '15px', justifyContent: 'right' }}>
        <img src={settingsIcon} alt="Settings Icon" className={`${styles.TopNavbar}`} onClick={() => setSettingsVisible(true)} />
      </div>

      <div className={`col-${isSettingsVisible ? '4' : '0'} offcanvascol`}>
        <div className={`offcanvasoffcanvas-end ${isSettingsVisible ? 'show' : ''}`} tabIndex="-1" id="offcanvasExample">
          <div className={`${styles.TopNavbar}`}>
            <h5 className={`${styles.TopNavbar}`}>Settings</h5>
            <button type="button" className={`${styles.TopNavbar}`} data-bs-dismiss={`${styles.TopNavbar}`} aria-label={`${styles.TopNavbar}`} onClick={() => setSettingsVisible(false)}></button>
          </div>
          <div className={`${styles.TopNavbar}`}>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
