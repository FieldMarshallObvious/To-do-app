import React from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {

  const navigate = useNavigate()
  const { logout } = useAuth();

  const handleSignOut = async() => {
    await logout();
    navigate("/"); 
  };

  
  return (
    <div>
      
      <button onClick={handleSignOut}>Logout</button>
    </div>
  );
};

export default Settings;