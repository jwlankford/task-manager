<template>
  <div id="app">
    <h1>My Task Manager</h1>
    <div class="task-input">
      <input
        type="text"
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task..."
      />
      <button @click="addTask">Add Task</button>
    </div>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ completed: task.completed }">
        <input type="checkbox" v-model="task.completed" @change="toggleTaskCompletion(task)" />
        <span>{{ task.text }}</span>
        <button @click="removeTask(task.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Get a reference to the 'tasks' collection
const tasksCollection = collection(db, 'tasks');

export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: [], // Tasks will now be loaded from Firebase
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      // Create a query against the collection.
      const q = query(tasksCollection, orderBy('createdAt', 'asc')); // Order tasks by creation time

      // Set up a real-time listener
      onSnapshot(q, (snapshot) => {
        const firebaseTasks = [];
        snapshot.forEach((doc) => {
          firebaseTasks.push({ id: doc.id, ...doc.data() });
        });
        this.tasks = firebaseTasks;
      });
    },
    async addTask() {
      if (this.newTask.trim() !== '') {
        try {
          await addDoc(tasksCollection, {
            text: this.newTask.trim(),
            completed: false,
            createdAt: new Date(), // Add a timestamp for ordering
          });
          this.newTask = '';
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    },
    async toggleTaskCompletion(task) {
      const taskRef = doc(db, 'tasks', task.id);
      try {
        await updateDoc(taskRef, {
          completed: task.completed,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },
    async removeTask(id) {
      const taskRef = doc(db, 'tasks', id);
      try {
        await deleteDoc(taskRef);
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    },
  },
};
</script>

<style>
/* Your existing styles remain the same */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.task-input {
  margin-bottom: 20px;
}

.task-input input {
  padding: 8px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.task-input button {
  padding: 8px 15px;
  margin-left: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.task-input button:hover {
  background-color: #369c6f;
}

.task-list {
  list-style: none;
  padding: 0;
  width: 400px;
  margin: 0 auto;
  text-align: left;
}

.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.task-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.task-list li input[type="checkbox"] {
  margin-right: 10px;
}

.task-list li button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.task-list li button:hover {
  background-color: #c0392b;
}
</style>