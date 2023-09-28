const admin = require('firebase-admin');
const functions = require('@google-cloud/functions-framework');


admin.initializeApp();
const db = admin.firestore();


functions.http('createUserDocument', async (req, res) => {
    try {
      // Get user data from request body
      const userData = req.body;
      
      if (!userData || !userData.userId) {
        res.status(400).send('User data with userId is required');
        return;
      }
  
      // Create a new user document in Firestore
      const userRef = db.collection('users').doc(userData.userId);
      await userRef.set(userData);
  
      // Send a success response
      res.status(201).send(`User document created with ID: ${userData.userId}`);
    } catch (error) {
      console.error('Error creating user document:', error);
      res.status(500).send('Internal Server Error');
    }
  });
