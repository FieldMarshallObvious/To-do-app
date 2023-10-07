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
  
      // Create a collection and add a document to it

        const collectionName = 'projects';
        const documentName = 'MISC';
        const documentData = {
            name: 'Jane Smith',
            age: 25,
            email: 'janesmith@example.com',
        };

        db.collection(collectionName)
            .doc(documentName)
            .set(documentData)
            .then((docRef) => {
                console.log('Document MISC created sucessfully.');
            })
            .catch((error) => {
                console.error('Error creating document:', 'MISC');
            });

      const userRef = db.collection('users').doc(userData.userId);
      await userRef.set(userData);

      String userName = "";
      int userAge = 0;

      userName = userData.name();
      userAge = userData.userAge();

      users.append(userName);
      users.append(userAge);
      // createUser({name: "Shawn", age: 30}) // TODO
  
      // Send a success response
      res.status(201).send(`User document created with ID: ${userData.userId}`);
    } catch (error) {
      console.error('Error creating user document:', error);
      res.status(500).send('Internal Server Error');
    }
  });

