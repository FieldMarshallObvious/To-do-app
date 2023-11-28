// src/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { CalendarWeek, Lock, Unlock } from 'react-bootstrap-icons';
import CreateTasks from '../ManageTasks/CreateTasks';
import EditTasks from '../ManageTasks/EditTasks';
import DeleteTasks from '../ManageTasks/DeleteTasks';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import DisplayProject from '../ManageTasks/DisplayProject';
import { Navbar } from 'react-bootstrap';
import '../NavBar/TopNavbar';

import ChartComponent from '../TaskChart/ChartComponents';
import { ListTask } from 'react-bootstrap-icons';

import styles from './Dashboard.module.css';
import CalendarWidget from '../TaskChart/CalendarWidget';
import TopNavbar from '../NavBar/TopNavbar.js';

const Dashboard = () => {
    const navigate = useNavigate()

   const { updateDisplayName, logout } = useAuth();
   const { getProjects, projects, getCardSettings, getLayout, getSnapPoints } = useUser();
   const [displayName, setDisplayName] = useState("");
   const [showProjectModal, setShowProjectModal] = useState(false);
   const [selectedOption, setSelectedOption] = useState('CreateTask');
   const [locked, setLocked] = useState(true);
   const [hover, setHover] = useState(false);
   const [isCalendarVisible, setContentVisibility] = useState(false);

    //Test task, navbar needs one passed to it
    const testTask = {
        name: "Test Task ",
        due_date: new Date('2023-12-31'),
      };
        // * Sign out the user
    const handleSignOut = async() => {
        await logout();
        // Navigate back to home route
       navigate("/"); 
    };

    // * Update the display name in the database
    const handleDisplayNameUpdate = () => {
        updateDisplayName(displayName).then(() => {
            console.log("Display Name Updated!");
        }).catch((error) => {
            console.error("Failed to update display name", error);
        });
    };

    const toggleContentVisibility = () => {
        setContentVisibility(!isCalendarVisible);
      };

    // * Get projects from database if they aren't
    // * already in the projects state
    useEffect(() => {
        const handleGetProjects = async () => { 
            try {
              await getProjects();
              await getCardSettings();
              await getLayout();
              await getSnapPoints();
            } catch (error) {
              console.error("Error getting projects: ", error);
            }
        };

        if (projects.length === 0) {
            handleGetProjects().then(() => {
                setLocked(false);
            }).catch((error) => {
                console.error("Error getting projects: ", error);
            });
        }

    }, [getProjects, projects]);

    const task = [
        { name: 'Task 1', completedTasks: 2}
      ];

      const tasksRemaining = 3;

    return (
        <Container fluid className={`justify-content-center`}>
        <Row className = "mx-auto" style={{paddingBottom: "20px"}} >
            <TopNavbar initialTask={testTask} />
        </Row>
        <Row className='mx-auto' style={{height: "100vh", display: "flex", flexDirection: "column"}}>
            <Row style={{justifyContent:'right', paddingTop: '50px', height: 'fit-content'}}>
                <Button className={`btn btn-primary ${styles.createProjectButton}`} onClick={() => setShowProjectModal(true)}> Create Project </Button>
                <Button className={`btn btn-primary ${styles.lockButton}`} onClick={() => setLocked(!locked)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    {!locked ?
                        <Lock size={30} color={hover ? 'white':'grey'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}/>
                        :
                        <Unlock size={30} color={hover ? 'white':'grey'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}/>  
                    }
                </Button>
            </Row>
            <Row>
                <DashboardLayout projects={projects} locked={locked} showProjectModal={showProjectModal} onClick={toggleContentVisibility} updateParentLocked={setLocked} setShowProjectModal={setShowProjectModal}/>
            </Row>
        </Row> 
        </Container>
    );
}

export default Dashboard;
