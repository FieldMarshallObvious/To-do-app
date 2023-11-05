import { React, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, PlusCircleFill, PencilSquare, Trash } from 'react-bootstrap-icons';
import { useUser } from '../../contexts/UserContext';
import { Timestamp } from '../../firebase';
import CalendarIcon from './DashboardIcons/calenderIcon.svg'; 
import ConfirmationModal from '../../utils/ConfirmationModel';


import styles from './CreateProjectsAndTask.module.css';

function DisplayProject({  }) {
    const [isEditingTask, setIsEditingTask] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(null);
    const [oldTaskName, setOldTaskName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [showModal, setShowModal] = useState(false);


    const [oldProjectName, setOldProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [openIndex, setOpenIndex] = useState([]);

    const { editProject, editTask, deleteTask, projects } = useUser();

    // * Edit project in the database
    const handleEditProject = async () => {
        try {
            let newPayload = { title: (projectName.trim() === "" ? oldProjectName : projectName) };
            let oldPayload = { title: oldProjectName };
            
            if ( newProjectDescription.trim() !== '' ) {
                newPayload.description = newProjectDescription;
            }
            // ! This is false while I work on this functionality
            if ( false ) {
                newPayload.Color = "blue";
            }
            const projectID = await editProject(newPayload, oldPayload);  
            console.log("Project ID: ", projectID);
            setOldProjectName('');
            setProjectName('');
            setNewProjectDescription('');
        } catch (error) {   
            console.error("Error creating project: ", error);
        }
    };

    // * Edit a task in the database
    const handleEditTask = async () => {
        try {
            let oldTaskData = { 'name': oldTaskName };
            let newTaskData = { 'name': (newTaskName.trim() === "" ? oldTaskName : newTaskName) };
            
            console.log("Old task name is", oldTaskData)

            if (newTaskDate) {
                const dateObj = new Date(newTaskDate);
    
                // Check if the date object is valid
                if (isNaN(dateObj.getTime())) {
                    console.error("The selected date is invalid.");
                    return;  // Exit the function
                }
    
                const timestamp = Timestamp.fromDate(dateObj);
                newTaskData['due_date'] = timestamp;
            } 
    
            const taskID = await editTask(projectName, oldTaskData, newTaskData);
            console.log("Task ID: ", taskID);
            setProjectName('');
            setNewTaskDate('');
            setNewTaskDate(null);
    
        } catch (error) {
            console.error("Error editing task: ", error);
        }
    };

    // * Delete a task in the database
    const handleDeleteTask = async (taskNameToDelete, projectNameToDelete) => {
        try {
            const taskID = await deleteTask(taskNameToDelete, projectNameToDelete);
            console.log("Task ID: ", taskID);
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
        setShowModal(false);
    };


    // Update the index when the number of projects has been loaded 
    useEffect(() => {
        if (projects && projects.length) {
            if ( openIndex.length == 0 ) {
                setOpenIndex(new Array(projects.length).fill(false));
            }
            setIsEditingTask(projects.map(project => 
                Array.isArray(project.Tasks) ? new Array(project.Tasks.length).fill(false) : []
            ));
        }
    }, [projects]);

    const handleNameSubmit = (projectIndex, taskIndex) => {
        handleEditTask();

        setIsEditingTask(isEditingTask.map((project, pIdx) => 
            pIdx === projectIndex ? project.map((task, tIdx) => tIdx === taskIndex ? false : task) : project
        ));
        // Reset the editedName state
        setNewTaskName('');
        setOldTaskName('');
    };

    const handleDoubleClick = (projectIndex, taskIndex, taskName, task) => {
        setNewTaskName(taskName);
        setOldTaskName(task.name);
        console.log("Handle double click task: ", task)
        if (task.due_date) {
            const dueDate = task.due_date.toDate(); 
            const formattedDate = dueDate.toISOString().split('T')[0];
            setNewTaskDate(formattedDate);
        } else {
            setNewTaskDate(''); 
        }

        setIsEditingTask(isEditingTask.map((project, pIdx) => 
            pIdx === projectIndex ? project.map((task, tIdx) => tIdx === taskIndex) : project
        ));
    };

    const formatDate = (timestamp) => {
        const date = timestamp.toDate();

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });    
    };


    const handleClick = index => {
        console.log("Clicked: ", index);    
        console.log("Projects: ", projects);
        setOpenIndex(openIndex.map((isOpen, i) => i === index ? !isOpen : isOpen));
        console.log("New Open Index: ", openIndex)
    };

    const handleShowModal = () => {
        setShowModal(true);
      };
    
    const handleCloseModal = () => {
    setShowModal(false);
    };


    return (
        <div className="container mt-5">
            {/* Project Name with Collapsible Content */}
            {projects.map((project, index) => (
                <div key={index}>
                  <button 
                        className={`btn btn-link d-flex justify-content-between align-items-center w-100 ${styles.projectHeading}`}
                        type="button" 
                        data-toggle="collapse" 
                        onClick={() => handleClick(index)}
                    >
                         <h2>{project.Title}</h2>
                         { openIndex[index] ? <ChevronUp /> : <ChevronDown /> }
                    </button>
                    
                    <div className={openIndex[index] ? "show" : "collapse"} style={{paddingTop: "10px"}}>                        
                        {Array.isArray(project?.Tasks) && project.Tasks.map((task, taskIndex )=> (
                            <div className="d-flex align-items-center p-3 border rounded mb-3" key={task.name}>
                                <div className="mb-3 rounded-circle" style={{ width: '20px', height: '20px', backgroundColor: '#007BFF' }}> </div>
                                <div className={`${styles.taskItem}`}>
                                    { isEditingTask[index] && isEditingTask[index][taskIndex]  ?
                                        <input
                                            type="text"
                                            onChange={(e) => { 
                                                setNewTaskName(e.target.value) 
                                                setProjectName(project.Title)
                                            }} 
                                            onBlur={() => handleNameSubmit(index, taskIndex)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleNameSubmit(index, taskIndex);
                                                }
                                            }}
                                            autoFocus
                                        />
                                        :
                                        <h2
                                            className="h5 mb-0"
                                            onDoubleClick={() => { 
                                                handleDoubleClick(index, taskIndex, task.name, task) 
                                            }
                                        }
                                        >
                                            {task.name}
                                        </h2>
                                    }
                                    <p className="mb-0" style={{ color: task.color ? task.color : "#053DA9" , display: "flex"}}> 
                                        <img src={CalendarIcon}/>
                                        <span style={{paddingLeft: "5px"}}>{task.due_date ? `${formatDate(task.due_date)}` : ""}</span> 
                                    </p>    
                                    <PencilSquare
                                        className={`editIcon ${styles.editIcon}`}
                                        onClick={() => handleDoubleClick(index, taskIndex, task.name, task)}
                                    />          
                                    <Trash 
                                        className={`editIcon ${styles.editIcon}`}
                                        onClick={() => { 
                                            handleShowModal()
                                        }} 
                                    />                  
                                </div>
                                <ConfirmationModal showModal={showModal}  
                                       handleCloseModal={handleCloseModal} 
                                       handleDanger={() => handleDeleteTask(task.name, project.Title)}
                                       ModelTitle={"Confirm Deletion"}
                                       ModelBody={"Are you sure you want to delete this task?"} 
                                       SecondaryText={"Cancel"}
                                       DangerText={"Delete"}/>
                            </div>
                        ))}
                        <PlusCircleFill color='#F0AF4D'/>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default DisplayProject;
