// src/firebase.js
const firebase = require('firebase/app');
require('firebase/firestore');

console.log("firebase/app import: ", firebase);

const firebaseConfig = {
  apiKey: "AIzaSyBDpgeSgZmDllDsBds_j2izgGLchOqcqK8",
  authDomain: "tasksmanager-8e768.firebaseapp.com",
  projectId: "tasksmanager-8e768",
  storageBucket: "tasksmanager-8e768.firebasestorage.app",
  messagingSenderId: "902344809807",
  appId: "1:902344809807:web:10dc670d6485967713f93a",
  measurementId: "G-QKRSEE0H45"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

const db = firebase.firestore(); // Or firebase.database() for Realtime Database

export { db };