import React, { useState } from 'react';
import { Card, Form, Button , Row, Col} from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import { DatePicker } from '@mui/lab';
import { Timestamp } from '../../firebase'; 

import styles from './CreateProjectsAndTask.module.css';

// ! Need to figre out how to integrate this into the Form.Control
const CustomDatePicker = React.forwardRef((props, ref) => (
    <DatePicker {...props} ref={ref} />
  ));  

const CreateTasks = () => {
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [getProjectTitle, setGetProjectTitle] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [selectedDate, setSelectedDate] = React.useState(null);
    const { createProject, createTask } = useUser();

    // * Create a project in the database
    const handleCreateProject = async () => {
        try {
            const projectID = await createProject({ title: projectTitle.replace(/\s+/g, '_'), description: projectDescription, color: 'blue' });  
            console.log("Project ID: ", projectID);
            setProjectTitle('');
            setProjectDescription('');
        } catch (error) {   
            console.error("Error creating project: ", error);
        }
    };

    // * Create a task in the database
    const handleCreateTask = async () => {
        try {
            let taskData = { 'name': taskTitle };
    
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
    
                // Check if the date object is valid
                if (isNaN(dateObj.getTime())) {
                    console.error("The selected date is invalid.");
                    return;  // Exit the function
                }
    
                const timestamp = Timestamp.fromDate(dateObj);
                taskData['due_date'] = timestamp;
            }
    
            const taskID = await createTask(getProjectTitle, taskData);
            console.log("Task ID: ", taskID);
    
        } catch (error) {
            console.error("Error creating task: ", error);
        }
    };

    return (
        <div>
           <Row>
           <Col xs={6} md={6} lg={6} style={{paddingTop: "20px"}}>
                <Card.Subtitle>Create Project</Card.Subtitle>
                <Form.Group  className={`d-flex align-items-center ${styles.formContainer}`} style={{marginTop: "20px"}}>
                    <Form.Label className="mb-0 mr-2">Project:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        style={{marginLeft: "10px"}}
                    />
                    <Form.Label className="mb-0 mr-2">Project Description:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        style={{marginLeft: "10px"}}
                    />
                </Form.Group>
                <Button variant="primary" style={{marginTop: "20px"}} onClick={handleCreateProject}>
                    Create Project
                </Button>
            </Col>

            <Col xs={6} md={6} lg={6} style={{paddingTop: "20px"}}>
                <Card.Subtitle>Create Task</Card.Subtitle>
                <Form.Group className="d-flex align-items-center" style={{marginTop: "20px"}}>
                    <div className="mb-2">
                    <Form.Label className="mb-0 mr-2">Project:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={getProjectTitle}
                        onChange={(e) => setGetProjectTitle(e.target.value)}
                        style={{marginLeft: "10px"}}
                    />
                    </div>
                    <div className="mb-2">
                    <Form.Label className="mb-0 mr-2" style={{marginLeft: "20px"}}>Task:</Form.Label>
                    <Form.Control
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        style={{marginLeft: "10px"}}/>
                    </div>
                    <div className='mb-2'>
                    <Form.Label className="mb-0 mr-2" style={{marginLeft: "20px"}}>Due Date:</Form.Label>
                    <Form.Control 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                    />
                    </div>
                </Form.Group>
                <Button variant="primary" style={{marginTop: "20px"}} onClick={handleCreateTask}>
                    Create Task
                </Button>
            </Col> 
            </Row>
        </div>
    );
}

export default CreateTasks;
