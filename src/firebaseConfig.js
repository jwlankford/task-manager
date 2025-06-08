import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth

// Your Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { db, auth }; // Export both db and auth