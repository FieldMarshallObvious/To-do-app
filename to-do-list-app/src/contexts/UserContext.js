import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import initialized Firebase
import { collection, doc, getDoc, setDoc, getDocs, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
};

export function UserProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectDocRef, setProjectDocRef] = useState([]);

  useEffect(() => {
    // Set up a listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
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
          setProjectDocRef((prevRefs) => [...prevRefs, doc]);
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
        const projectDocRef = doc(projectRef, project.title);
        const projectSnapshot = await getDoc(projectDocRef);

        if ( projectSnapshot.exists ) {
          await setDoc(projectDocRef, {Tasks: [], Title: project.title, description: project.description, Color: project.color});
          setProjects((prevProjects) => [...prevProjects, { id: projectDocRef.id, ...project }]);
          setProjectDocRef((prevRefs) => [...prevRefs, projectDocRef]);
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
      const projectDocRef = doc(projectRef, oldProjectTitle.title);

      try {
        const projectSnapshot = await getDoc(projectDocRef);

        if ( projectSnapshot.exists ) {
          let payload = {};
          if ( project.title ) {
            payload.Title = project.title;
          }
          if ( project.tasks ) {
            payload.Tasks = project.tasks;
          }
          if ( project.description ) {
            payload.description = project.description;
          }
          if ( project.color ) {
            payload.Color = project.color;
          }

          setProjects((prevProjects) => {
            const editedProjects = prevProjects.map((p) => { 
              if (p.id === oldProjectTitle.title) {
                return { id: project.title, ...payload };
              }
              return p;
            });

            return editedProjects;
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



  const createTask = async (project, task) => {
    if (currentUser) {
      if ( project.trim() === '' ) {
        project = 'Default';
      }

      if (!task || task.name.trim() === '') {
        console.error("Task input is empty or undefined");
        return;
      }

      const userID = currentUser.uid;
      const projectsRef = collection(db, 'Users', userID, 'projects') 
      const projectDocRef = doc(projectsRef, project);
      try {
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
      const projectDocRef = doc(projectsRef, project);
  
      try {
        const projectSnapshot = await getDoc(projectDocRef);
        if (!projectSnapshot.exists()) {
          console.error("Project does not exist");
          return;
        }
        const currentTasks = projectSnapshot.data().Tasks || [];
  
        const taskIndex = currentTasks.findIndex(t => t.name === oldTask.name);
        if (taskIndex === -1) {
          console.error("Task not found");
          return;
        }
        currentTasks[taskIndex] = newTask;
        
        setProjects((prevProjects) => {
          const editedProjects = prevProjects.map((p) => { 
            if (p.id === project) {
              return { id: project, ...projectSnapshot.data(), Tasks: currentTasks };
            }
            return p;
          });
  
          return editedProjects;
        });
        await updateDoc(projectDocRef, { Tasks: currentTasks });
        return projectDocRef.id;
  
      } catch (error) {
        console.error("Error editing task: ", error);
        throw error;
      }
    }
  }; 
  

  const value = {
    currentUser,
    projects,
    projectDocRef,
    getProjects,
    createProject,
    createTask,
    editProject, 
    editTask,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
