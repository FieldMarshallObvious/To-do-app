import React from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Link, useNavigate } from "react-router-dom";
import styles from './Settings.module.css'; 
import logoutButtonImage from './logoutbutton.svg';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate("/"); 
  };

  return (
    <div className={styles.Sidebar}>
      <button onClick={handleSignOut} className={styles.LogoutButton}>
        <img src={logoutButtonImage} alt="Log out" /> 
        Log out 
      </button>
    </div>
  );
};

export default Settings;