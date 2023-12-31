import { Timestamp } from '../firebase';



// * Create a project in the database
export const handleCreateProject = async (createProject, projectTitle, projectDescription, color) => {
    try {
        const projectID = await createProject({ title: projectTitle, description: projectDescription, color: color });  
        console.log("Project ID: ", projectID);
    } catch (error) {   
        console.error("Error creating project: ", error);
    }
};

// * Create a task in the database
export const handleCreateTask = async (createTask, taskTitle, color, projectTitle, taskDate) => {
    try {
        let taskData = { 'name': taskTitle, 'completed': false };

        if (taskDate) {
            let dateObj = new Date(taskDate + 'T00:00:00');

            dateObj = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 
                              dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds())

            // Check if the date object is valid
            if (isNaN(dateObj.getTime())) {
                console.error("The selected date is invalid.");
                return;  // Exit the function
            }

            const timestamp = Timestamp.fromDate(dateObj);
            taskData['due_date'] = timestamp;
        }

        if (color) {
            taskData['color'] = color;
        }   

        const taskID = await createTask(projectTitle, taskData);
        console.log("Task ID: ", taskID);

    } catch (error) {
        console.error("Error creating task: ", error);
    }
};

// * Edit project in the database
export const handleEditProject = async ( editProject, projectName, oldProjectName, newProjectDescription, color) => {
    try {
        let newPayload = { title: (projectName.trim() === "" ? oldProjectName : projectName) };
        let oldPayload = { title: oldProjectName };
        
        if ( newProjectDescription.trim() !== '' ) {
            newPayload.description = newProjectDescription;
        }
        // ! This is false while I work on this functionality
        if ( color ) {
            newPayload.Color = color;
        }
        const projectID = await editProject(newPayload, oldPayload);  
        console.log("Project ID: ", projectID);
    } catch (error) {   
        console.error("Error creating project: ", error);
    }
};

// * Edit a task in the database
export const handleEditTask = async (editTask, oldTaskName, newTaskName, newTaskDate, projectName) => {
    try {
        let oldTaskData = { 'name': oldTaskName };
        let newTaskData = { 'name': (newTaskName.trim() === "" ? oldTaskName : newTaskName) };
        
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
    } catch (error) {
        console.error("Error editing task: ", error);
    }
};

// * Delete a project in the database
export const handleDeleteProject = async (deleteProject, projectTitle) => {
    try {
        const projectID = await deleteProject(projectTitle);
        console.log("Project ID: ", projectID);
    } catch (error) {
        console.error("Error deleting project: ", error);
    }
};

// * Delete a task in the database
export const handleDeleteTask = async (deleteTask, taskNameToDelete, projectNameToDelete) => {
    try {
        const taskID = await deleteTask(taskNameToDelete, projectNameToDelete);
        console.log("Task ID: ", taskID);
    } catch (error) {
        console.error("Error deleting task: ", error);
    }
};