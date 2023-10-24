// src/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import CreateTasks from '../ManageTasks/CreateTasks';
import EditTasks from '../ManageTasks/EditTasks';
import DeleteTasks from '../ManageTasks/DeleteTasks';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import DisplayProject from '../ManageTasks/DisplayProject';

const Dashboard = () => {
    const navigate = useNavigate()

   const { updateDisplayName, logout } = useAuth();
   const { getProjects, createProject, createTask, projects } = useUser();
   const [displayName, setDisplayName] = useState("");
   const [selectedOption, setSelectedOption] = useState('CreateTask');
   const [layout, setLayout] = useState([{ i: "a", x: 0, y: 0, w: 4, h: 1 },
                                         { i: "b", x: 0, y: 1, w: 4, h: 1 },
                                         { i: "c", x: 10, y: 2, w: 4, h: 1 }])

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

    // *Handle update to the layout
    const handeLayoutChange = (newLayout) => {
        setLayout(newLayout);
    }



    // * Get projects from database if they aren't
    // * already in the projects state
    useEffect(() => {
        const handleGetProjects = async () => { 
            try {
              await getProjects();
            } catch (error) {
              console.error("Error getting projects: ", error);
            }
        };

        if (projects.length === 0) {
            handleGetProjects().then(() => {
            }).catch((error) => {
                console.error("Error getting projects: ", error);
            });
        }

    }, [getProjects, projects]);

    
    
    
    // * Formate the firebase timestamp to a readable date
    const formatDate = (timestamp) => {
        const date = timestamp.toDate();

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });    
    };

    return (
        <Container fluid className={`justify-content-center`}>
        <Row className='mx-auto'>
        <DashboardLayout projects={projects} layout={layout} updateParentLayout={handeLayoutChange}/>
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
