
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const cors = require("cors")({origin: true});


if (process.env.NODE_ENV === "development") {
  admin.initializeApp({projectId: "to-do-app-c2dba"});
} else {
  admin.initializeApp();
}
const db = admin.firestore();

exports.createUserDocument = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Get user data from request body
      const userData = req.body;

      console.error(userData);

      if (!userData || !userData.userId) {
        console.log(userData);
        res.status(400).send("User data with userId is required");
        return;
      }


      // Create a collection and add a document to it
      const collectionName = "Users";
      const documentName = userData.userId;
      const documentData = {
        name: userData.name,
        age: userData.age,
      };

      console.log(collectionName);
      console.log(documentName);
      console.log(documentData);

      db.collection(collectionName)
          .doc(documentName)
          .set(documentData)
          .then((docRef) => {
            console.log(documentName, "was created sucessfully.");
          })
          .catch((error) => {
            console.error("Error creating document:", error);
          });

      // eslint-disable-next-line max-len
      const userRef = db.collection("Users").doc(userData.userId).collection("projects").doc("Default");
      await userRef.set({Title: "Default", Tasks: {}});

      // Send a success response
      res.status(201).send(`User document created with ID: ${userData.userId}`);
    } catch (error) {
      console.error("Error creating user document:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});


