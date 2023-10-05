import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import { Timestamp } from '../../firebase'; 

import styles from './CreateProjectsAndTask.module.css';


const EditTasks = () => {
    const [oldProjectTitle, setOldProjectTitle] = useState('');
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [getProjectTitle, setGetProjectTitle] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [oldTaskTitle, setOldTaskTitle] = useState('');
    const [selectedDate, setSelectedDate] = React.useState(null);
    const { editProject, editTask } = useUser();

    // * Edit project in the database
    const handleEditProject = async () => {
        try {
            let newPayload = { title: (newProjectTitle.trim() === "" ? oldProjectTitle : newProjectTitle) };
            let oldPayload = { title: oldProjectTitle };
            
            if ( projectDescription.trim() !== '' ) {
                newPayload.description = projectDescription;
            }
            // ! This is false while I work on this functionality
            if ( false ) {
                newPayload.Color = "blue";
            }
            const projectID = await editProject(newPayload, oldPayload);  
            console.log("Project ID: ", projectID);
            setOldProjectTitle('');
            setNewProjectTitle('');
            setProjectDescription('');
        } catch (error) {   
            console.error("Error creating project: ", error);
        }
    };

    // * Edit a task in the database
    const handleEditTask = async () => {
        try {
            let oldTaskData = { 'name': oldTaskTitle };
            let newTaskData = { 'name': (newTaskTitle.trim() === "" ? oldTaskTitle : newTaskTitle) };
    
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
    
                // Check if the date object is valid
                if (isNaN(dateObj.getTime())) {
                    console.error("The selected date is invalid.");
                    return;  // Exit the function
                }
    
                const timestamp = Timestamp.fromDate(dateObj);
                newTaskData['due_date'] = timestamp;
            }
    
            const taskID = await editTask(getProjectTitle, oldTaskData, newTaskData);
            console.log("Task ID: ", taskID);
            setGetProjectTitle('');
            setNewTaskTitle('');
            setSelectedDate(null);
    
        } catch (error) {
            console.error("Error creating task: ", error);
        }
    };

    return (
        <div>
           <Row>
           <Col xs={6} md={6} lg={6} style={{paddingTop: "20px"}}>
                <Card.Subtitle>Edit Project</Card.Subtitle>
                <Form.Group  className={`d-flex align-items-center ${styles.formContainer}`} style={{marginTop: "20px"}}>
                    <Form.Label className="mb-0 mr-2">Old Project:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={oldProjectTitle}
                        onChange={(e) => setOldProjectTitle(e.target.value)}
                        style={{marginLeft: "10px"}}
                    />
                    <Form.Label className="mb-0 mr-2">New Project:</Form.Label> 
                    <Form.Control
                        type="text"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        style={{marginLeft: "10px"}}
                    />
                    <Form.Label className="mb-0 mr-2"> New Description:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        style={{marginLeft: "10px"}}
                    />
                </Form.Group>
                <Button variant="primary" style={{marginTop: "20px"}} onClick={handleEditProject}>
                    Edit Project 
                </Button>
            </Col>

            <Col xs={6} md={6} lg={6} style={{paddingTop: "20px"}}>
                <Card.Subtitle>Edit Task</Card.Subtitle>
                <Form.Group className="d-flex flex-column" style={{marginTop: "20px"}}>
                    <div className="mb-2">
                        <Form.Label className="mb-0">Project:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={getProjectTitle}
                            onChange={(e) => setGetProjectTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <Form.Label className="mb-0">Old Task Title:</Form.Label>
                        <Form.Control
                            type="text"
                            value={oldTaskTitle}
                            onChange={(e) => setOldTaskTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <Form.Label className="mb-0">New Task Title:</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <Form.Label className="mb-0">Due Date:</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={selectedDate} 
                            onChange={e => setSelectedDate(e.target.value)} 
                        />
                    </div>
                </Form.Group>
                <Button variant="primary" style={{marginTop: "20px"}} onClick={handleEditTask}>
                    Create Task
                </Button>
            </Col> 
            </Row>
        </div>
    );
}

export default EditTasks; 
