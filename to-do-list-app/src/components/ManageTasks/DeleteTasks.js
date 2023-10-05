// Create a bioler plate file for delete task options
// Compare this snippet from src/components/ManageTasks/EditTasks.js:

import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';

import styles from './CreateProjectsAndTask.module.css';

const DeleteTasks = () => {
    const [projectTitle, setProjectTitle] = useState('');
    const [getProjectTitle, setGetProjectTitle] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const { deleteProject, deleteTask } = useUser();


    // * Delete a project in the database
    const handleDeleteProject = async () => {
        try {
            const projectID = await deleteProject(projectTitle);
            console.log("Project ID: ", projectID);
            setProjectTitle('');
        } catch (error) {
            console.error("Error deleting project: ", error);
        }
    };

    // * Delete a task in the database
    const handleDeleteTask = async () => {
        try {
            const taskID = await deleteTask(taskTitle, getProjectTitle);
            console.log("Task ID: ", taskID);
            setTaskTitle('');
            setGetProjectTitle('');
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };


    return (
        <>
        <Row>
            <Col xs={6} md={6} lg={6} style={{paddingTop: "20px"}}>
                <Card.Subtitle>Delete Project</Card.Subtitle>
                <Form.Group  className={`d-flex align-items-center ${styles.formContainer}`} style={{marginTop: "20px"}}>                    
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                </Form.Group>
                <Button variant="primary" style={{marginTop: "20px"}} onClick={handleDeleteProject}> 
                    Delete Project
                </Button>
            </Col>
            <Col xs={6} md={6} lg={6} style={{paddingTop: "20px"}}>
                <Card.Subtitle>Delete Task</Card.Subtitle>
                <Form.Group  className={`d-flex align-items-center ${styles.formContainer}`} style={{marginTop: "20px"}}>                    
                    <Form.Label>Get Project Title</Form.Label>
                    <Form.Control type="text" value={getProjectTitle} onChange={(e) => setGetProjectTitle(e.target.value)} />
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                </Form.Group>
                <Button variant="primary" style={{marginTop: "20px"}} onClick={handleDeleteTask}> 
                    Delete Task
                </Button>
            </Col>
        </Row>
        </>
    );
}

export default DeleteTasks;
