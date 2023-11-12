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
import Widget from '../../utils/CalendarWidget';
import ChartComponent from '../../utils/ChartComponents';
import { ListTask } from 'react-bootstrap-icons';

import styles from './Dashboard.module.css';
import CalendarWidget from '../../utils/CalendarWidget';
import TopNavbar from '../NavBar/TopNavbar.js';

const Dashboard = () => {
    const navigate = useNavigate()

   const { updateDisplayName, logout } = useAuth();
   const { getProjects, createProject, createTask, projects, getCardSettings, getLayout } = useUser();
   const [displayName, setDisplayName] = useState("");
   const [showProjectModal, setShowProjectModal] = useState(false);
   const [selectedOption, setSelectedOption] = useState('CreateTask');
    const [locked, setLocked] = useState(true);
    const [hover, setHover] = useState(false);

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

    // * Get projects from database if they aren't
    // * already in the projects state
    useEffect(() => {
        const handleGetProjects = async () => { 
            try {
              await getProjects();
              await getCardSettings();
              await getLayout();
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
        // Add more events as needed

    return (
        <Container fluid className={`justify-content-center`}>
        <Row className = "mx-auto" style={{paddingBottom: "20px"}} >
            <TopNavbar initialTask={testTask} />
        </Row>
        <Row className='mx-auto'>
            <Row style={{justifyContent:'right'}}>
                <Button className={`btn btn-primary ${styles.createProjectButton}`} onClick={() => setShowProjectModal(true)}> Create Project </Button>
                <Button className={`btn btn-primary ${styles.lockButton}`} onClick={() => setLocked(!locked)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    {!locked ?
                        <Lock size={30} color={hover ? 'white':'grey'}/>:<Unlock size={30} color={hover ? 'white':'grey'}/> 
                    }
                </Button>
            </Row>
            <DashboardLayout projects={projects} locked={locked} showProjectModal={showProjectModal} updateParentLocked={setLocked}/>
        </Row> 
        <Row className="mx-auto">
        <Col xs={12} md={6} lg={4}>
            
            <Card>
                <Card.Body>
                <Card.Title>User Info</Card.Title>
                <Form.Group>
                    <Form.Label>New Display Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                    />
                </Form.Group>
                <div style={{paddingTop: "20px"}}>
                    <Button variant="primary" onClick={handleDisplayNameUpdate}>
                        Update Display Name
                    </Button>
                </div>
                <Card.Text style={{paddingBottom: "5px", paddingTop: "20px", margin: "0"}}>
                    This is a sign out button
                </Card.Text>
                <Button variant="primary" onClick={handleSignOut}>
                    Sign Out
                </Button>
                </Card.Body>
            </Card>
        </Col>
        <Col xs={12} md={6} lg={8}>
            <Card>
                <Card.Body>
                <Card.Title>Projects</Card.Title>
                <Row>
                <Col xs={6} md={6} lg={6}>
                    <Card style={{marginTop: "20px"}}>
                        <Card.Body>
                            <DisplayProject projects={projects} />
                            <ChartComponent tasks={task} title="Tasks Completed / Remaining" 
                            tasksComplete={task.completedTasks} 
                            tasksRemaining={tasksRemaining} />
                        </Card.Body>
                    </Card>
                </Col>
                </Row>
                </Card.Body>
            </Card>
        </Col>
        </Row>
        <Row className="mx-auto" style={{marginTop: "20px"}}>
            <Card>
            <Card.Body>
            <div>
                <h2>Calendar with Tasks</h2>
                <CalendarWidget
                    tileContent={({ date, view }) => (
                    <CalendarWidget date={date} view={view} />
                    )}
                />
                </div>
                <Col xs={6} md={6} lg={6}>

                <Form.Control as="select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                    <option value="" disabled>Select an option</option>
                    <option value="CreateTask">Create Task or Project</option>
                    <option value="EditTask">Edit Task or Project</option>
                    <option value="DeleteTask">Delete Task or Project</option>
                </Form.Control>
                </Col>

                {selectedOption === 'CreateTask' && (
                    <CreateTasks />
                )}
                {selectedOption === 'EditTask' && (
                    <EditTasks />
                )}
                {selectedOption === 'DeleteTask' && (
                    <DeleteTasks />
                )}

            </Card.Body>
            </Card>
        </Row>
        </Container>
    );
}

export default Dashboard;
