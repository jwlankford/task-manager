<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-container class="max-w-md">
        <v-card class="pa-6 rounded-xl elevation-12">
          <v-card-title class="text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
            My Task Manager
          </v-card-title>

          <v-card-text>
            <v-row no-gutters class="mb-6 align-center" v-if="!isMobile">
              <v-col cols="12" sm="9">
                <v-text-field
                  v-model="newTask"
                  label="Add a new task..."
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @keyup.enter="addTask"
                  ref="addTaskInput"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" class="d-flex justify-end mt-2 mt-sm-0">
                <v-btn
                  icon="mdi-plus-circle"
                  color="green-darken-2"
                  size="large"
                  class="ml-2"
                  @click="addTask"
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
                    :disabled="showEditDialog"
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

    <v-dialog
      v-model="showEditDialog"
      :fullscreen="$vuetify.display.mobile"
      :scrim="!$vuetify.display.mobile"
      max-width="500px"
      transition="dialog-bottom-transition"
    >
      <v-card :class="{ 'rounded-0': $vuetify.display.mobile }">
        <v-toolbar
          :color="$vuetify.display.mobile ? 'green-darken-3' : 'white'"
          :flat="$vuetify.display.mobile"
        >
          <v-btn icon @click="cancelEdit">
            <v-icon :color="$vuetify.display.mobile ? 'white' : 'grey-darken-1'">mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title :class="{ 'text-white': $vuetify.display.mobile }">Edit Task</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              variant="text"
              @click="saveEditedTask"
              :color="$vuetify.display.mobile ? 'white' : 'green-darken-2'"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-text-field
            v-model="newTask"
            label="Edit task..."
            variant="outlined"
            density="comfortable"
            hide-details
            @keyup.enter="saveEditedTask"
            autofocus
            ref="editTaskInput"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      showEditDialog: false, // Controls the visibility of the edit overlay
    };
  },
  computed: {
    isMobile() {
      // Access Vuetify's display breakpoint information
      return this.$vuetify.display.mobile;
    }
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
        return;
      }
      try {
        await addDoc(tasksCollection, {
          text: this.newTask.trim(),
          completed: false,
          createdAt: new Date(),
        });
        this.newTask = '';
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
       fungicideDoc(taskRef);
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    },
    startEditing(task) {
      this.editingTask = task.id;
      this.newTask = task.text;
      this.showEditDialog = true; // Open the dialog
      this.$nextTick(() => {
        // Focus the input inside the dialog after it opens
        if (this.$refs.editTaskInput) {
          this.$refs.editTaskInput.focus();
        }
      });
    },
    async saveEditedTask() {
      if (this.newTask.trim() === '') {
        console.warn("Task cannot be empty. Edit cancelled.");
        this.cancelEdit();
        return;
      }

      if (this.editingTask) {
        const taskRef = doc(db, 'tasks', this.editingTask);
        try {
          await updateDoc(taskRef, {
            text: this.newTask.trim(),
          });
          this.cancelEdit(); // Reset editing state and close dialog
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    },
    cancelEdit() {
      this.editingTask = null;
      this.newTask = '';
      this.showEditDialog = false; // Close the dialog
    },
  },
};
</script>

<style>
/* No more custom CSS needed, Vuetify handles it! */
</style>