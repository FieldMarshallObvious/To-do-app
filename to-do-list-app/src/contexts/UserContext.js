import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import initialized Firebase
import { collection, doc, getDoc, setDoc, getDocs, addDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { sanitizeData } from '../utils/ObjectUtils';
export const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
};

export function UserProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjectsState] = useState([]);
  const [nearestTask,  setNeartestTask] = useState(null);
  const [cardSettings, setCardSettingsState] = useState({
      "a": {
          displayOption: "projects",
          selectedProjects: ["all"]
      },
      "b": {
          displayOption: "projects",
          selectedProjects: ["all"]
      },
      "c": {
          displayOption: "projects",
          selectedProjects: ["all"]
      }
});
  const [layout, setLayoutState] = useState([{ i: "a", x: 0, y: 0, w: 6, h: 2 },
                                             { i: "b", x: 10, y: 0, w: 6, h: 1 },
                                             { i: "c", x: 10, y: 2, w: 6, h: 1 }])
  const [snapPoints, setSnapPoints] = useState({x: [0, 10], y:[0, 1, 2]});

  const setCardSettings = (newSettings) => {
    if (newSettings === null) {
      console.error("Can't set card settings to null");
      return;
    }

    setCardSettingsState(newSettings);
    return;
  }

  const setLayout = (newLayout) => {
    if (newLayout === null) {
      console.error("Can't set layout to null");
      return;
    }
    setLayoutState(newLayout);
    return;
  }

  const setProjects = (newProjects) => {
    let soonestProject = null;
    let soonestTaskIndex = -1;
    let allProjectsEmptyOrCompleted = true;

    console.log("New Projects are", newProjects)

    newProjects.forEach((p) => {
      // Convert p.Tasks to an array if it's an object, or default to an empty array
      const tasksArray = Array.isArray(p.Tasks) ? p.Tasks : Object.values(p.Tasks);
       
      tasksArray.forEach((t, index) => {
        console.log("Task", t)
        if (!t.completed) { 
          if (soonestTaskIndex == -1 || (p.Tasks[soonestTaskIndex] && p.Tasks[soonestTaskIndex].due_date > t.due_date)) {
            soonestProject = p;
            soonestTaskIndex = index;
            allProjectsEmptyOrCompleted = false;
          }
        }
      });
    });
  

    console.log("Soonest Project", soonestProject)

    setProjectsState(newProjects)
    if (allProjectsEmptyOrCompleted) {
      setNeartestTask("None");
    } else {
      setNeartestTask(soonestProject ? soonestProject.Tasks[soonestTaskIndex] : null);
    }
  }

  useEffect(() => {
    // Set up a listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setProjects([]);
      setCurrentUser(user);
    });

    // Clean up the listener on component unmount
    return unsubscribe;
  }, []);

  const getProjects = async () => {
    const projectData = [];
    if (currentUser) {
      let userID = currentUser.uid;
      let tasksRef = collection(db, 'Users', userID, 'projects');      
      try {
        const querySnapshot = await getDocs(tasksRef);
        querySnapshot.forEach((doc) => {
          projectData.push({ id: doc.id, ...doc.data() });
        });
        setProjects(projectData);
        
        return projectData;
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        throw error;
      }
    }
  };

  const createProject = async (project) => {
    console.log("Project: ", project);
    if (currentUser && project) {
      const userID = currentUser.uid;
  
      if (project.title.trim() === '') {
        console.error("Project title is required");
        throw new Error("Project title is required");
      }
  
      const projectRef = collection(db, 'Users', userID, 'projects'); 

      try {
        let projectExists = projects.find((p) => p.Title === project.title);

        if ( !projectExists ) {
          let payload =  {Tasks: [], Title: project.title, description: project.description, Color: project.color}
          
          const projectDocRef = await addDoc(projectRef, payload);   

          const newProject = { id: projectDocRef.id, ...payload };

          console.log("New Project: ", newProject);

          let newProjects = [...projects, newProject];
          
          setProjects(newProjects);
          return project;
        }
        else {
          console.error("Project already exists");
          throw new Error("Project already exists");
        }
      } catch (error) {
        console.error("Error creating project: ", error);
        throw error;
      }
    }
  };

  const editProject = async (project, oldProjectTitle) => { 
    if ( currentUser && project ) {
      const userID = currentUser.uid;
      
      if ( oldProjectTitle.title.trim() === '' ) {
        console.error("Old Project title is required");
        throw new Error("Old Project title is required");
      }

      const projectRef = collection(db, 'Users', userID, 'projects');
      let projectLocalRef = projects.find((p) => p.Title === oldProjectTitle.title);
      const projectDocRef = doc(projectRef, projectLocalRef.id);

      try {
        const projectSnapshot = await getDoc(projectDocRef);

        if ( projectSnapshot.exists ) {
          let payload = {};

          if ( project.title || oldProjectTitle.title ) payload.Title = project.title ? project.title : oldProjectTitle.title;
          if ( project.Tasks || projectSnapshot.data().Tasks ) payload.Tasks = project.tasks ? project.tasks : projectSnapshot.data().Tasks;
          if ( project.description || projectSnapshot.data().description ) payload.description = project.description ? project.description : projectSnapshot.data().description;
          if ( project.color || projectSnapshot.data().color ) payload.Color = project.color ? project.color : projectSnapshot.data().Color;

          console.log("Edit Payload is ", payload)

          let newProjects = projects.map((p) => {
            if (p.Title === oldProjectTitle.title) {
              return { id: project.title, ...payload };
            }
            return p;
          });
          
          setProjects(newProjects);

          // * Iterate over previous state to to update card settings project
          setCardSettings((prevSettings) => {
            let editedSettings = {...prevSettings};
            
            Object.keys(prevSettings).forEach((key) => {
              if (prevSettings[key].selectedProjects.includes(oldProjectTitle.title)) {
                editedSettings[key] = {
                  ...prevSettings[key],
                  selectedProjects: prevSettings[key].selectedProjects.map((p) => 
                    p === oldProjectTitle.title ? project.title : p
                  )
                };
              }
            });
          
            // Return the edited settings
            return editedSettings;
          });

          await setDoc(projectDocRef, payload);
          return project;
        }
        else {
          console.error("Project does not exist");
          throw new Error("Project does not exist");
        }
      } catch (error) {
        console.error("Error editing project: ", error);
        throw error;
      }
    }
  };

  const deleteProject = async (project) => {
    if (currentUser) {
      const userID = currentUser.uid;
      const projectRef = collection(db, 'Users', userID, 'projects');
      let projectRefID = projects.find((p) => p.Title === project);
      const projectDocRef = doc(projectRef, projectRefID.id);
  
      try {
        const projectSnapshot = await getDoc(projectDocRef);
        if (!projectSnapshot.exists()) {
          console.error("Project does not exist");
          return;
        }
        await deleteDoc(projectDocRef);
        let newProjects = projects.filter((p) => p.Title !== project);
        setProjects(newProjects);

        return projectDocRef.id;
      } catch (error) {
        console.error("Error deleting project: ", error);
        throw error;
      }
    }
  }



  const createTask = async (project, task) => {
    if (currentUser) {
      if ( project.trim() === '' ) {
        project = 'Default';
      }

      if (!task || task.name.trim() === '') {
        console.error("Task input is empty or undefined");
        return;
      }

      let projectRef = projects.find((p) => p.Title === project);

      const userID = currentUser.uid;
      const projectsRef = collection(db, 'Users', userID, 'projects');
      const projectDocRef = doc(projectsRef, projectRef.id);
      try {
        let newProjects = projects.map((p) => {
          if (p.id === projectRef.id) {
            // Ensure projectRef.Tasks is an array before using the spread syntax
            const tasks = Array.isArray(projectRef.Tasks) ? projectRef.Tasks : [];
            return { id: projectRef.id, ...projectRef, Tasks: [...tasks, task] };
          }
          return p;
        });

        setProjects(newProjects);

        await updateDoc(projectDocRef, {
          Tasks: arrayUnion(task)
        });
        return projectDocRef.id;
      } catch (error) {
        console.error("Error creating task: ", error);
        throw error;
      }
    }
  };


  const editTask = async (project, oldTask, newTask) => {
    if (currentUser) {
      if (project.trim() === '') {
        project = 'Default';
      }
  
      if (!newTask || newTask.name.trim() === '') {
        console.error("New task input is empty or undefined");
        return;
      }
  
      const userID = currentUser.uid;
      const projectsRef = collection(db, 'Users', userID, 'projects')

      let projectRef = projects.find((p) => p.Title === project);


      const projectDocRef = doc(projectsRef, projectRef.id);
  
      try {
        const projectSnapshot = await getDoc(projectDocRef);
        if (!projectSnapshot.exists()) {
          console.error("Project does not exist");
          return;
        }
        const currentTasks = projectSnapshot.data().Tasks || [];

        console.log("Current tasks are", currentTasks);
        console.log("Old task name", oldTask.name);
  
        const taskIndex = currentTasks.findIndex(t => t.name === oldTask.name);
        if (taskIndex === -1) {
          console.error("Task not found");
          return;
        }
        currentTasks[taskIndex] = newTask;
        
        
        let editedProjects = projects.map((p) => { 
          if (p.Title === project) {
            return { id: project, ...projectSnapshot.data(), Tasks: currentTasks };
          }
          return p;
        });

        setProjects(editedProjects);

        await updateDoc(projectDocRef, { Tasks: currentTasks });
        return projectDocRef.id;
  
      } catch (error) {
        console.error("Error editing task: ", error);
        throw error;
      }
    }
  };
  const setTaskCompleteLocal = (project, task, completed) => {
    if (currentUser) {
      if (project.trim() === '') {
        project = 'Default';
      }

      const currentTasks = projects.find((p) => p.Title === project).Tasks || [];
      console.log("Current tasks", currentTasks);
      const taskObject = currentTasks.find((t) => t.name === task);
      console.log("Task object", taskObject);
  
      if (taskObject) {
        taskObject.completed = completed; // Directly modify the 'completed' property of the task object
  
        
        let editedProjects = projects.map((p) => { 
          if (p.Title === project) {
            return { ...p, Tasks: currentTasks }; // Ensure all properties of the project are preserved
          }
          return p;
        });

        setProjects(editedProjects);
  
        return true;
      } else {
        return false;
      }
    }
  }
  
  const setTaskCompleteDatabase = async (project, task, completed) => {
    if (currentUser) {
      if (project.trim() === '') {
        project = 'Default';
      }
  
      if (!task || task.trim() === '') {
        console.error("Task input is empty or undefined");
        return;
      }
  
      const userID = currentUser.uid;
      const projectsRef = collection(db, 'Users', userID, 'projects');
      let projectRef = projects.find((p) => p.Title === project);
      const projectDocRef = doc(projectsRef, projectRef.id);
  
      try {
        const projectSnapshot = await getDoc(projectDocRef);
        if (!projectSnapshot.exists()) {
          console.error("Project does not exist");
          return;
        }
        const currentTasks = projectSnapshot.data().Tasks || [];
  
        const taskIndex = currentTasks.findIndex(t => t.name === task);
        if (taskIndex === -1) {
          console.error("Task not found");
          return;
        }
        currentTasks[taskIndex].completed = completed;
  
        let editedProjects = projects.map((p) => { 
          if (p.Title === project) {
            return { id: project, ...projectSnapshot.data(), Tasks: currentTasks };
          }
          return p;
        });
  
        setProjects(editedProjects);
  
        await updateDoc(projectDocRef, { Tasks: currentTasks });
        return projectDocRef.id;
  
      } catch (error) {
        console.error("Error completing task: ", error);
        throw error;
      }
    }
  }

  const deleteTask = async (task, project) => {
    if (currentUser) {
      if (project.trim() === '') {
        project = 'Default';
      }
  
      if (!task || task.trim() === '') {
        console.error("Task input is empty or undefined");
        return;
      }
  
      const userID = currentUser.uid;
      const projectsRef = collection(db, 'Users', userID, 'projects');
      let projectRef = projects.find((p) => p.Title === project);
      console.log("Project ref is ", projectRef)
      const projectDocRef = doc(projectsRef, projectRef.id);
  
      try {
        const projectSnapshot = await getDoc(projectDocRef);
        if (!projectSnapshot.exists()) {
          console.error("Project does not exist");
          return;
        }
        const currentTasks = projectSnapshot.data().Tasks || [];
  
        const taskIndex = currentTasks.findIndex(t => t.name === task);
        if (taskIndex === -1) {
          console.error("Task not found");
          return;
        }
        currentTasks.splice(taskIndex, 1);

        let editedProjects = projects.map((p) => { 
          if (p.Title === project) {
            return { id: project, ...projectSnapshot.data(), Tasks: currentTasks };
          }
          return p;
        });

        setProjects(editedProjects);
  
        await updateDoc(projectDocRef, { Tasks: currentTasks });
        return projectDocRef.id;
  
      } catch (error) {
        console.error("Error deleting task: ", error);
        throw error;
      }
    }
  }

  const getSnapPoints = async () => {
    if (currentUser) {
      const userID = currentUser.uid;
      const snapPointsRef = doc(db, 'Users', userID);
      try {
        const snapPointsSnapshot = await getDoc(snapPointsRef);
        if (snapPointsSnapshot.exists()) {
          const snapPoints = snapPointsSnapshot.data();
          if (snapPoints.snapPoints) {
            setSnapPoints(snapPoints.snapPoints);
          } else {
            setSnapPoints({ x: [0, 10], y: [0, 1, 2] });
          }
          return snapPoints;
        } else {
          console.error("Snap points do not exist");
          return;
        }
      } catch (error) {
        console.error("Error fetching snap points: ", error);
        throw error;
      }
    }
  }

  const getCardSettings = async () => {
    if (currentUser) {
      const userID = currentUser.uid;
      const settingsRef = doc(db, 'Users', userID);
      try {
        const settingsSnapshot = await getDoc(settingsRef);
        if (settingsSnapshot.exists()) {
          const settings = settingsSnapshot.data();
          if (settings.cardSettings) {
            console.log("Card settings are", settings.cardSettings)
            setCardSettings(settings.cardSettings);
          } else {
            setCardSettings({
              "a": {
                  displayOption: "projects",
                  selectedProjects: ["all"]
              },
              "b": {
                  displayOption: "projects",
                  selectedProjects: ["all"]
              },
              "c": {
                  displayOption: "projects",
                  selectedProjects: ["all"]
              }});
          }
          return settings;
        } else {
          console.error("Settings do not exist");
          return;
        }
      } catch (error) {
        console.error("Error fetching settings: ", error);
        throw error;
      }
    }
  }

  const saveCardSettingsAndLayout = (newSettings, newLayout, newSnapPoints) => {
    if (currentUser) {
      const userID = currentUser.uid;
      const settingsRef = doc(db, 'Users', userID);
      
      console.log("new settings are ", newSettings)
      console.log("new layout is ", newLayout)

      const cleanedSettings = sanitizeData(newSettings);
      const cleanedLayout = sanitizeData(newLayout); 
      const cleanedSnapPoints = sanitizeData(newSnapPoints);
      
      console.log("Cleaned Settings are", cleanedSettings)
      console.log("Cleaned Layout is", cleanedLayout)
      try {
        updateDoc(settingsRef, {
          cardSettings: cleanedSettings,
          layout: cleanedLayout,
          snapPoints: cleanedSnapPoints
        });
      } catch (error) {
        console.error("Error saving card settings: ", error);
        throw error;
      }
    }
  };

  const getLayout = async () => {
    if (currentUser) {
      const userID = currentUser.uid;
      const layoutRef = doc(db, 'Users', userID);
      try {
        const layoutSnapshot = await getDoc(layoutRef);
        if (layoutSnapshot.exists()) {
          const layout = layoutSnapshot.data();
          if (layout.layout) {
            setLayout(layout.layout);
          } else {
            setLayout([{ i: "a", x: 0, y: 0, w: 6, h: 2 },
            { i: "b", x: 10, y: 0, w: 6, h: 1 },
            { i: "c", x: 10, y: 2, w: 6, h: 1 }]);
          }
          return layout;
        } else {
          console.error("Layout does not exist");
          return;
        }
      } catch (error) {
        console.error("Error fetching layout: ", error);
        throw error;
      }
    }
  }
  

  const value = {
    currentUser,
    projects,
    cardSettings,
    layout,
    snapPoints,
    nearestTask,
    getSnapPoints,
    setCardSettings,
    setLayout,
    setSnapPoints,
    getProjects,
    createProject,
    createTask,
    editProject, 
    editTask,
    deleteTask,
    deleteProject,
    setTaskCompleteLocal,
    setTaskCompleteDatabase,
    getCardSettings,
    saveCardSettingsAndLayout,
    getLayout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
