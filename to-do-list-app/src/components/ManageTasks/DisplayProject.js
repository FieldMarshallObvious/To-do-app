import { React, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, PlusCircleFill, PencilSquare, Trash } from 'react-bootstrap-icons';
import { useUser } from '../../contexts/UserContext';
import CalendarIcon from './DashboardIcons/calenderIcon.svg'; 
import ConfirmationModal from '../../utils/ConfirmationModel';
import ProjectModal from '../../utils/ProjectModal';
import TaskModal from '../../utils/TaskModal';
import { ReactSVG } from 'react-svg';
import  numericFormatDate from '../../utils/numericFormatDate';
import { handleCreateProject, 
         handleCreateTask, 
         handleEditProject, 
         handleEditTask, 
         handleDeleteTask, handleDeleteProject } from '../../utils/TaskUtils';
import { Col } from 'react-bootstrap';

import styles from './CreateProjectsAndTask.module.css';

function DisplayProject({ showProjectModal, setShowProjectModal, projects, isEditing }) {
    const [isEditingTask, setIsEditingTask] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(null);
    const [oldTaskName, setOldTaskName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [openIndex, setOpenIndex] = useState([]);
    const [showProjectModalEdit, setShowProjectModalEdit] = useState(false);
    const [showProjectDelete, setShowProjectDelete] = useState(false);

    const { createProject, createTask, editProject, editTask, deleteTask, deleteProject, setTaskCompleteLocal, setTaskCompleteDatabase } = useUser();

    const handleNameSubmit = (projectIndex, taskIndex) => {
        handleEditTask(editTask, oldTaskName, newTaskName, newTaskDate, projectName);

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



    const handleClick = index => {
        console.log("Clicked: ", index);    
        console.log("Projects: ", projects);
        setOpenIndex(openIndex.map((isOpen, i) => i === index ? !isOpen : isOpen));
    };

    const handleShowModal = () => {
        setShowModal(true);
      };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Assuming project.Tasks is part of a state that can be updated
    const handleCircleClick = async (project, taskName, taskCompleted) => {
       await setTaskCompleteLocal(project, taskName, !taskCompleted);
       await setTaskCompleteDatabase(project, taskName, !taskCompleted);
       console.log("After complete: ", projects);
    };

    // Update the index when the number of projects has been loaded 
    useEffect(() => {
        if (projects && projects.length) {
            if ( openIndex.length == 0 && projects.length != 0) {
                setOpenIndex(new Array(projects.length).fill(false));
            }

            setIsEditingTask(projects.map(project => 
                Array.isArray(project.Tasks) ? new Array(project.Tasks.length).fill(false) : []
            ));
        }
    }, [projects]);

    return (
        <div className="container mt-5">
            {/* Project Name with Collapsible Content */}
            {projects.map((project, index) => (
                <div key={index}>
                  <button 
                        className={`btn btn-link d-flex justify-content-between align-items-center w-100 ${styles.projectHeading} ${styles.projectItem}`}
                        type="button" 
                        data-toggle="collapse" 
                        onClick={() => handleClick(index)}
                    >
                         <h2>{project.Title}</h2>
                         { isEditing ? 
                            <>
                            <PencilSquare
                                className={`editIcon ${styles.editIcon}`}
                                onClick={() => 
                                    setShowProjectModalEdit(true)
                                }
                                style={{position: "absolute", right: "150px"}}
                            />   
                            <Trash 
                                className={`editIcon ${styles.editIcon}`}
                                onClick={() => { 
                                    setShowProjectDelete(true)
                                }} 
                                style={{position: "absolute", right:"100px"}}
                            /> 
                            </>
                            : <></>
                        }
                         { openIndex[index] ? <ChevronUp /> : <ChevronDown /> }
                    </button>
                    
                    <div className={`${openIndex[index] ? "show" : "collapse"}`} style={{paddingTop: "10px"}}>                        
                        {Array.isArray(project?.Tasks) && project.Tasks.map((task, taskIndex )=> (
                            <div className="d-flex align-items-center p-3 border rounded mb-3" key={task.name} style={{color: task.completed ? "grey":""}}>
                                <div
                                className="d-flex align-items-center justify-content-center mb-3 rounded-circle"
                                onClick={() => handleCircleClick(project.Title, task.name, task.completed)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: `white`,
                                    border: `2px solid ${task.color ? task.color : "#053DA9"}`,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s', 
                                }}
                                >
                                    <div className='rounded-circle' style={{
                                        width: '13px',
                                        height: '13px',
                                        backgroundColor: task.completed ? `${task.color ? task.color : "#053DA9"}` : 'white',
                                        margin: '0',
                                        marginTop: '0.5px',
                                        transition: 'background-color 0.2s',
                                    }} />
                                </div>
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
                                                    handleNameSubmit(index, taskIndex, task.name, newTaskName, newTaskDate);
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
                                        <ReactSVG src={CalendarIcon} beforeInjection={ 
                                            svg => {
                                                svg.classList.add(styles.calendarIcon);
                                                const paths = svg.querySelectorAll('path');
                                                paths.forEach(path => {
                                                    path.setAttribute('fill', task.color ? task.color : "#053DA9");
                                                });
                                                svg.setAttribute('width', '20px', 'height', '10px');
                                            }
                                        }/>
                                        <span style={{paddingLeft: "5px"}}>{task.due_date ? `${numericFormatDate(task.due_date)}` : ""}</span> 
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
                                       handleDanger={() => { 
                                                                handleDeleteTask(deleteTask, task.name, project.Title) 
                                                                setShowModal(false)
                                                            }}
                                       ModelTitle={"Confirm Deletion"}
                                       ModelBody={"Are you sure you want to delete this task?"} 
                                       SecondaryText={"Cancel"}
                                       DangerText={"Delete"}
                                      />
                            </div>
                        ))}
                        <TaskModal
                            show={showTaskModal}
                            onHide={() => { setShowTaskModal(false) }}
                            projects={projects.map(innerProject => innerProject.Title)}
                            currentProject={project.Title}
                            onCreateTask={handleCreateTask}
                            createTask={createTask} />

                        <div className="d-flex justify-content-end" style={{width: "100%"}} >
                            <PlusCircleFill color='#F0AF4D' size="48px" className='ml-auto' onClick={() => { 
                                console.log("Clicked add task");
                                setShowTaskModal(true);
                                }}/>
                        </div>
                    </div>

                    {/* Create Project Modal */}
                    <ProjectModal 
                        show={showProjectModal} 
                        onHide={() => setShowProjectModal(false)} 
                        onCreateProject={handleCreateProject}
                        createProject={createProject}
                    />

                    {/* Edit Project Modal */}
                    <ProjectModal 
                        show={showProjectModalEdit} 
                        onHide={() => setShowProjectModal(false)} 
                        onEditProject={handleEditProject}
                        isEditProject={true}
                        editProject={editProject}
                        oldProjectTitle={project.Title}
                        oldProjectDescription={project.Description}
                    />

                    {/* Delete Project Modal */}
                    <ConfirmationModal showModal={showProjectDelete}  
                                            handleCloseModal={handleCloseModal} 
                                            handleDanger={() => { 
                                                                        handleDeleteProject(deleteProject, project.Title) 
                                                                        setShowProjectDelete(false)
                                                                    }}
                                            ModelTitle={"Confirm Deletion"}
                                            ModelBody={"Are you sure you want to delete this project?"} 
                                            SecondaryText={"Cancel"}
                                            DangerText={"Delete"}
                    />
                </div>
            ))}
  
        </div>
    );
}

export default DisplayProject;
