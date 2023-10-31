import React, {useState} from "react";

import {Link} from "react-router-dom"; 
import './TopNavbar.css';

const task = {
  due_date: new Date(), 
  name: "Some name",
  color: "some color"
};

export const TopNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  return (

   <nav>
    <Link to = "/<Website" className = "title">Settings</Link>
    <div className = "menu" onClick={() => {
        setMenuOpen(!menuOpen);
    }}>

      <div>Task Name: {task.name}</div>
      <div>Due Date: {task.due_date.toString()}</div>
      <div>Task Color: {task.color}</div>

      <span></span> 
      <span></span> 
      <span></span> 
    </div>
    <ul className={menuOpen ? "open" : ""}>
      <Link to = "Account">Account</Link> 

</ul> 
  </nav>
    
  );
}; 

export default TopNavbar
