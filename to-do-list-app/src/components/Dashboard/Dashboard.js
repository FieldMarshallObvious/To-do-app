// src/Dashboard.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom"

const Dashboard = () => {
    const navigate = useNavigate()
  
    const handleSignOut = () => {
        // Navigate back to home route
       navigate("/") 
    };

    return (
        <Container fluid>
        <Row>
            <Col xs={12} md={6} lg={3}>
            <Card>
                <Card.Body>
                <Card.Title>Sign Out</Card.Title>
                <Card.Text>
                    This is a sign out button
                </Card.Text>
                <Button variant="primary" onClick={handleSignOut}>
                    Sign Out
                </Button>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
}

export default Dashboard;
