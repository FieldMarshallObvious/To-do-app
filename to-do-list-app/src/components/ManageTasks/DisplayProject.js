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
    const [openModalProjectIndexEdit, setOpenModalProjectIndexEdit] = useState(null);
    const [openModalProjectIndexDelete, setOpenModalProjectIndexDelete] = useState(false);
    const [openModalTaskCreateIndex, setOpenModalTaskCreateIndex] = useState(null);
    const [openTaskModalIndexDelete, setOpenTaskModalIndexDelete] = useState(null);

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
            if (projects.length !== openIndex.length) {
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
                         <h2 className={styles.ProjectTitle}>{project.Title}</h2>
                         { isEditing ? 
                            <>
                            <PencilSquare
                                className={`editIcon ${styles.editIcon}`}
                                onClick={() => 
                                    setOpenModalProjectIndexEdit(index)
                                }
                                style={{position: "absolute", right: "150px"}}
                            />   
                            <Trash 
                                className={`editIcon ${styles.editIcon}`}
                                onClick={() => { 
                                    setOpenModalProjectIndexDelete(index)
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
                                        position: 'relative',
                                        width: '14px',
                                        height: '14px',
                                        backgroundColor: task.completed ? `${task.color ? task.color : "#053DA9"}` : 'white',
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
                                            setOpenTaskModalIndexDelete(task.name)
                                            handleShowModal()
                                        }} 
                                    />                  
                                </div>
                                <ConfirmationModal showModal={showModal && openTaskModalIndexDelete === task.name && openTaskModalIndexDelete != null ? true : false}  
                                       handleCloseModal={handleCloseModal} 
                                       handleDanger={() => { 
                                                                handleDeleteTask(deleteTask, task.name, project.Title) 
                                                                setShowModal(false)
                                                            }}
                                       ModelTitle={"Confirm Task Deletion"}
                                       ModelBody={`Are you sure want to delete ${task.name}?`} 
                                       SecondaryText={"Cancel"}
                                       DangerText={"Delete"}
                                      />
                            </div>
                        ))}
                        <TaskModal
                            show={showTaskModal && openModalTaskCreateIndex === project.Title && openModalTaskCreateIndex != null ? true : false}
                            onHide={() => { setShowTaskModal(false) }}
                            projects={projects.map(innerProject => innerProject.Title)}
                            currentProject={project.Title}
                            onCreateTask={handleCreateTask}
                            createTask={createTask} />

                        <div className="d-flex justify-content-end" style={{width: "100%"}} >
                            <PlusCircleFill color={`${project.Color ? project.Color : "#F0AF4D"}`} size="40px" className='ml-auto' onClick={() => { 
                                console.log("Clicked add task");
                                setOpenModalTaskCreateIndex(project.Title);
                                setShowTaskModal(true);
                                }}/>
                        </div>
                    </div>

                    {/* Create Project Modal */}
                    <ProjectModal 
                        show={showProjectModal} 
                        onHide={() => { setShowProjectModal(false) }} 
                        onCreateProject={handleCreateProject}
                        createProject={createProject}
                    />

                    {/* Edit Project Modal */}
                    <ProjectModal 
                        show={openModalProjectIndexEdit === index && openModalProjectIndexEdit != null ? true : false} 
                        onHide={() =>  { setOpenModalProjectIndexEdit(null) }} 
                        onEditProject={handleEditProject}
                        isEditProject={true}
                        editProject={editProject}
                        oldProjectTitle={project.Title}
                        oldProjectDescription={project.description}
                        oldProjectColor={project.Color}
                    />
                    

                    {/* Delete Project Modal */}
                    <ConfirmationModal showModal={openModalProjectIndexDelete === index && openModalProjectIndexDelete != null ? true : false}  
                                            handleCloseModal={() => setOpenModalProjectIndexDelete(null)} 
                                            handleDanger={() => { 
                                                                        handleDeleteProject(deleteProject, project.Title) 
                                                                        setOpenModalProjectIndexDelete(null)
                                                                    }}
                                            ModelTitle={`Confirm Delete ${project.Title}`}
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
