<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-container class="max-w-md">
        <v-card class="pa-6 rounded-xl elevation-12">
          <v-card-title class="text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
            My Task Manager
          </v-card-title>

          <v-card-text>
            <v-row no-gutters class="mb-6 align-center">
              <v-col cols="12" sm="9"> <v-text-field
                  v-model="newTask"
                  :label="editingTask ? 'Edit task...' : 'Add a new task...'"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @keyup.enter="editingTask ? saveEditedTask() : addTask()"
                  :autofocus="editingTask !== null"
                  ref="taskInput"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" class="d-flex justify-end mt-2 mt-sm-0"> <v-btn
                  v-if="!editingTask"
                  icon="mdi-plus-circle"
                  color="green-darken-2"
                  size="large"
                  class="ml-2"
                  @click="addTask"
                ></v-btn>
                <v-btn
                  v-if="editingTask"
                  icon="mdi-check"
                  color="green-darken-2"
                  size="large"
                  class="ml-2"
                  @click="saveEditedTask"
                ></v-btn>
                <v-btn
                  v-if="editingTask"
                  icon="mdi-close"
                  color="red-darken-1"
                  size="large"
                  class="ml-2"
                  @click="cancelEdit"
                ></v-btn>
              </v-col>
            </v-row>

            <v-list class="bg-transparent">
              <v-list-item
                v-for="task in tasks"
                :key="task.id"
                :class="{ 'text-decoration-line-through text-grey-darken-1': task.completed }"
                class="mb-3 pa-0 rounded-lg bg-grey-lighten-5 elevation-2"
              >
                <template v-slot:prepend>
                  <v-list-item-action>
                    <v-checkbox-btn
                      v-model="task.completed"
                      @change="toggleTaskCompletion(task)"
                      color="green-darken-2"
                    ></v-checkbox-btn>
                  </v-list-item-action>
                </template>

                <v-list-item-title class="text-h6 py-2">{{ task.text }}</v-list-item-title>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="blue-darken-1"
                    @click="startEditing(task)"
                    :disabled="!!editingTask"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="red-darken-1"
                    @click="removeTask(task.id)"
                  ></v-btn>
                </template>
              </v-list-item>
              <v-list-item v-if="tasks.length === 0" class="text-center text-grey-darken-1">
                No tasks yet! Add one above.
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Your Firebase configuration (keep this the same)
const firebaseConfig = {
  apiKey: "AIzaSyBDpgeSgZmDllDsBds_j2izgGLchOqcqK8",
  authDomain: "tasksmanager-8e768.firebaseapp.com",
  projectId: "tasksmanager-8e768",
  storageBucket: "tasksmanager-8e768.firebasestorage.app",
  messagingSenderId: "902344809807",
  appId: "1:902344809807:web:10dc670d6485967713f93a",
  measurementId: "G-QKRSEE0H45"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCollection = collection(db, 'tasks');

export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: [],
      editingTask: null, // Stores the ID of the task being edited
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      const q = query(tasksCollection, orderBy('createdAt', 'asc'));
      onSnapshot(q, (snapshot) => {
        const firebaseTasks = [];
        snapshot.forEach((doc) => {
          firebaseTasks.push({ id: doc.id, ...doc.data() });
        });
        this.tasks = firebaseTasks;
      });
    },
    async addTask() {
      if (this.newTask.trim() === '') {
        // Prevent adding empty tasks
        return;
      }
      try {
        await addDoc(tasksCollection, {
          text: this.newTask.trim(),
          completed: false,
          createdAt: new Date(),
        });
        this.newTask = ''; // Clear the input after adding
      } catch (error) {
        console.error("Error adding document: ", error);
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
    startEditing(task) {
      this.editingTask = task.id;
      this.newTask = task.text; // Populate the input field with the task's current text
      // Focus the input field when starting edit
      this.$nextTick(() => {
        this.$refs.taskInput.focus();
      });
    },
    async saveEditedTask() {
      if (this.newTask.trim() === '') {
        console.warn("Task cannot be empty. Edit cancelled.");
        this.cancelEdit();
        return;
      }

      if (this.editingTask) { // Ensure we are in edit mode
        const taskRef = doc(db, 'tasks', this.editingTask);
        try {
          await updateDoc(taskRef, {
            text: this.newTask.trim(),
          });
          this.cancelEdit(); // Reset editing state
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    },
    cancelEdit() {
      this.editingTask = null;
      this.newTask = ''; // Clear the input field
    },
  },
};
</script>

<style>
/* No more custom CSS needed, Vuetify handles it! */
/* You can remove any previous <style> block completely */
</style>