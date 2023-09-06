const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
require("dotenv").config();

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_apiKey,
  authDomain: process.env.VITE_authDomain,
  projectId: process.env.VITE_projectId,
  storageBucket: process.env.VITE_storageBucket,
  messagingSenderId: process.env.VITE_messagingSenderId,
  appId: process.env.VITE_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

module.exports = { database };

/* const firebase = require("firebase");

const firebaseConfig = {
  apiKey: process.env.VITE_apiKey,
  authDomain: process.env.VITE_authDomain,
  projectId: process.env.VITE_projectId,
  storageBucket: process.env.VITE_storageBucket,
  messagingSenderId: process.env.VITE_messagingSenderId,
  appId: process.env.VITE_appId,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const users = db.collection("users");
module.exports = users;
 */
