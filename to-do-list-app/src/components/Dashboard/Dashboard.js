// src/Dashboard.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';


const Dashboard = () => {
    const navigate = useNavigate()

   const { updateDisplayName, logout } = useAuth();
   const { getProjects } = useUser();
   const [displayName, setDisplayName] = useState("");

   const [projects, setProjects] = useState({});

    // Sign out the user
    const handleSignOut = async() => {
        await logout();
        // Navigate back to home route
       navigate("/"); 
    };

    // Update the display name in the database
    const handleDisplayNameUpdate = () => {
        updateDisplayName(displayName).then(() => {
            console.log("Display Name Updated!");
        }).catch((error) => {
            console.error("Failed to update display name", error);
        });
    };

    // Grab the projects fron the database
    const handleGetProjects = async () => { 
        try {
          const projectData = await getProjects();
          setProjects(projectData);

          console.log("Projects: ", projects);
        } catch (error) {
          console.error("Error getting projects: ", error);
        }
    };
    
    // Formate the firebase timestamp to a readable date
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
                    <div style={{paddingTop: "20px"}}>
                        <Form.Group>
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" /> 
                        </Form.Group>
                        <Button variant="primary">
                            Create Project
                        </Button>
                    </div>
                </Col>
                <Col xs={6} md={6} lg={6}>
                    <div style={{paddingTop: "20px"}}>
                        <Button variant="primary" onClick={handleGetProjects}>
                            Get Projects
                        </Button>
                    </div>

                    <Card style={{marginTop: "20px"}}>
                        <Card.Body>
                        {Object.values(projects).map(project => (
                            <div key={project.id}>
                                <Card.Subtitle>{project.id.replace(/_/g, ' ')}</Card.Subtitle>
                                {project.Tasks.map(task => (
                                    <div key={task.name}>
                                        {task.name} - {formatDate(task.due_date)} 
                                    </div>
                                    ))
                                }
                            </div>
                        ))}
                        </Card.Body>
                    </Card>
                </Col>
                </Row>
                </Card.Body>
            </Card>
        </Col>
        </Row>
        </Container>
    );
}

export default Dashboard;
