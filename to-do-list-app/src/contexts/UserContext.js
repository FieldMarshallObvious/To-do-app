import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import initialized Firebase
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
};

export function UserProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

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
        });
        return projectData;
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        throw error;
      }
    }
  };

  const createProject = async (project) => {
    if (currentUser) {
      let userID = currentUser.uid;
      let projectsRef = db.collection('users').doc(userID).collection('projects');
      try {
        const docRef = await projectsRef.add(project);
        return docRef.id;
      } catch (error) {
        console.error("Error creating project: ", error);
        throw error;
      }
    }
  };

  const createTask = async (project,task) => {
    if (currentUser) {
      let userID = currentUser.uid;
      let projectRef = db.collection('users').doc(userID).collection('projects').doc(project).collection('tasks');
      try {
        const docRef = await projectRef.add(task);
        return docRef.id;
      } catch (error) {
        console.error("Error creating task: ", error);
        throw error;
      }
    }
  };
  

  const value = {
    currentUser,
    getProjects
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
