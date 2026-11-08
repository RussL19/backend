const {
  initializeApp,
  applicationDefault,
  getApps
} = require("firebase-admin/app");

let firebaseApp;

// Evitar inicializar Firebase más de una vez
if (getApps().length === 0) {
  firebaseApp = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  console.log("Firebase Admin SDK inicializado correctamente.");
} else {
  firebaseApp = getApps()[0];
}

module.exports = firebaseApp;