import React, { useContext, useState, useEffect } from "react"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';  // Adjust the path according to your file structure
import { getFunctions, httpsCallable } from 'firebase/functions';


const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)


  function signup(username, email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is created, now sign them in
        return signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            // User is signed in, proceed with your logic
            const user = userCredential.user;

            console.log("User that asked for request was ", user.uid)

            // Prepare the endpoint URL. Replace `your-region` and `your-project-id` with your actual Firebase function's region and your Firebase project ID.
            const functionUrl = `https://us-central1-to-do-app-c2dba.cloudfunctions.net/createUserDocument`;

            // Prepare the payload
            const userData = {
              userId: user.uid,
              name: username,
              age: 30
            };

            // Make an HTTP POST request to the function's endpoint
            fetch(functionUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('There was an error creating user document:', error);
            });
          });
      });
  }
  
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function updateDisplayName(displayName) {
    return updateProfile(currentUser, {
      displayName: displayName,
    }).then(() => {
      // Profile updated!
      // Note: If you need to have the latest user data, reload the user.
      setCurrentUser({ ...currentUser, displayName: displayName });
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateDisplayName
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}