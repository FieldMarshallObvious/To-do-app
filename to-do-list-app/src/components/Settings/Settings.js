import React from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Link, useNavigate } from "react-router-dom";
import styles from './Settings.module.css'; 

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate("/"); 
  };

  return (
    <div className={styles.Sidebar}>
      {/* Your sidebar content */}
      <button onClick={handleSignOut} className={styles.LogoutButton}>Logout</button>
    </div>
  );
};

export default Settings;