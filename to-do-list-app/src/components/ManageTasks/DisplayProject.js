import { React, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';


function DisplayProject({ projects }) {

    const [openIndex, setOpenIndex] = useState([]);

    // Update the index when the number of projects has been loaded 
    useEffect(() => {
        if (projects && projects.length) {
            setOpenIndex(new Array(projects.length).fill(false));
        }
    }, [projects]);


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

    return (
        <div className="container mt-5">
            
            {/* Project Name with Collapsible Content */}
            {projects.map((project, index) => (
                <div key={index}>
                  <button 
                        className="btn btn-link d-flex justify-content-between align-items-center w-100" 
                        type="button" 
                        data-toggle="collapse" 
                        onClick={() => handleClick(index)}
                    >
                        {project.Title}
                         { openIndex[index] ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    <div className={openIndex[index] ? "show" : "collapse"}>                        
                        {Array.isArray(project?.Tasks) && project.Tasks.map(task => (
                            <div className="d-flex align-items-center p-3 border rounded mb-3" key={task.name}>
                                <div className="me-3 rounded-circle" style={{ width: '20px', height: '20px', backgroundColor: '#007BFF' }}></div>
                                <div>
                                    <h2 className="h5 mb-0">{task.name}</h2>
                                    <p className="mb-0 text-muted"><i className="bi bi-calendar"></i> {task.due_date ? `- ${formatDate(task.due_date)}` : ""} </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default DisplayProject;
