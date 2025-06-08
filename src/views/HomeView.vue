<template>
  <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
    <v-container class="max-w-md">
      <v-card class="pa-6 rounded-xl elevation-12">
        <v-card-title
          class="d-flex justify-space-between align-center text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
          My Task Manager
          <v-btn icon="mdi-logout" variant="text" color="red-darken-1" @click="handleLogout" title="Logout"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-row no-gutters class="mb-6 align-center">
            <v-col cols="12" sm="9" class="pr-sm-2">
              <v-text-field v-model="newTask" label="Add a new task" variant="outlined" clearable hide-details
                density="compact" @keyup.enter="addTask" ref="addTaskInput"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" class="mt-4 mt-sm-0 pl-sm-2">
              <v-btn color="green-darken-3" variant="elevated" block @click="addTask" :disabled="!newTask.trim()">
                Add Task
              </v-btn>
            </v-col>
          </v-row>

          <v-list class="bg-transparent">
            <template v-if="tasks.length > 0">
              <v-list-item
                v-for="task in tasks"
                :key="task.id"
                class="mb-3 rounded-lg"
                :class="{ 'completed-task': task.completed }"
                elevation="2"
              >
                <template v-slot:prepend>
                  <v-list-item-action start>
                    <v-checkbox-btn :model-value="task.completed" @click.stop="toggleTaskCompletion(task)"></v-checkbox-btn>
                  </v-list-item-action>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ task.text }}
                </v-list-item-title>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="primary"
                    size="small"
                    @click.stop="startEditing(task)"
                    class="mr-2"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="red"
                    size="small"
                    @click.stop="removeTask(task.id)"
                  ></v-btn>
                </template>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item class="text-center text-grey-darken-1">
                <v-list-item-title>No tasks yet! Add one above.</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>

  <v-dialog v-model="showEditDialog" :fullscreen="isMobile" :scrim="!isMobile" max-width="500px" transition="dialog-bottom-transition">
    <v-card class="pa-4 rounded-xl elevation-12">
      <v-card-title class="text-h5 text-center mb-4">Edit Task</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newTask"
          label="Task"
          variant="outlined"
          density="compact"
          hide-details
          @keyup.enter="saveEditedTask"
          ref="editTaskInput"
          class="mb-4" ></v-text-field>
        <v-btn
          color="success"
          variant="elevated"
          block
          @click="saveEditedTask"
          class="mb-4" >Save</v-btn>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" variant="text" @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue';
import { useDisplay } from 'vuetify';

import { db, auth } from '@/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'HomeView',
  setup() {
    const { currentUser, authLoading, logout } = useAuth();
    const router = useRouter();

    // 1. Declare all reactive state variables (refs) first
    const newTask = ref('');
    const tasks = ref([]);
    const editingTask = ref(null);
    const showEditDialog = ref(false);

    const addTaskInput = ref(null); // Ref for focusing new task input
    const editTaskInput = ref(null); // Ref for focusing edit task input

    const isMobile = computed(() => {
      // Access useDisplay directly here for computed property
      return useDisplay().mobile.value;
    });

    // 2. Define all functions that will be used
    // This function FETCHES tasks from Firestore
    const fetchTasks = (userId) => {
      console.log('fetchTasks function DEFINITION called with userId:', userId); // Log from definition

      if (!userId) {
          console.warn("fetchTasks called with no userId, clearing tasks.");
          tasks.value = [];
          return;
      }

      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'asc')
      );

      // onSnapshot will listen for real-time updates and automatically update 'tasks' ref
      onSnapshot(q, (snapshot) => {
        console.log('onSnapshot listener triggered!');
        const firebaseTasks = [];
        snapshot.forEach((doc) => {
          const taskData = { id: doc.id, ...doc.data() };
          firebaseTasks.push(taskData);
          console.log('  - Added task from Firestore:', taskData);
        });
        tasks.value = firebaseTasks; // Update the reactive tasks array
        console.log('Tasks array updated. Current tasks:', tasks.value);
      }, (error) => {
          console.error("Error in onSnapshot listener:", error);
      });
    };

    // This function ADDS a new task to Firestore
    const addTask = async () => {
      console.log('addTask function called!');
      console.log('newTask value:', newTask.value);
      console.log('currentUser value:', currentUser.value);

      if (newTask.value.trim() === '') {
        console.warn("Task input is empty, not adding.");
        return;
      }

      if (!currentUser.value) { // Double check currentUser before adding
        console.warn("No user logged in, cannot add task.");
        return;
      }

      try {
        await addDoc(collection(db, 'tasks'), {
          text: newTask.value.trim(),
          completed: false,
          createdAt: new Date(),
          userId: currentUser.value.uid, // Ensure userId is saved with the task
        });
        newTask.value = ''; // Clear the input field
        console.log('Task added successfully to Firestore!');
      } catch (error) {
        console.error("Error adding document to Firestore: ", error);
      }
    };

    // This function TOGGLES the completion status of a task in Firestore
    const toggleTaskCompletion = async (task) => {
      const taskRef = doc(db, 'tasks', task.id);
      try {
        // Toggle the completed status based on its current value
        await updateDoc(taskRef, {
          completed: !task.completed, // Toggle the value
        });
        console.log('Task completion toggled in Firestore for:', task.id);
      } catch (error) {
        console.error("Error updating task completion: ", error);
      }
    };

    // This function REMOVES a task from Firestore
    const removeTask = async (id) => {
      const taskRef = doc(db, 'tasks', id);
      try {
        await deleteDoc(taskRef);
        console.log('Task removed from Firestore:', id);
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    };

    // This function prepares the dialog for editing a task
    const startEditing = (task) => {
      editingTask.value = task.id; // Store the ID of the task being edited
      newTask.value = task.text; // Populate the input with the current task text
      showEditDialog.value = true; // Show the dialog
      nextTick(() => { // Focus the input field after the dialog is rendered
        if (editTaskInput.value) {
          editTaskInput.value.focus();
        }
      });
    };

    // This function saves the edited task to Firestore
    const saveEditedTask = async () => {
      if (newTask.value.trim() === '') {
        console.warn("Task cannot be empty. Edit cancelled.");
        cancelEdit();
        return;
      }

      if (editingTask.value) { // Ensure there's a task being edited
        const taskRef = doc(db, 'tasks', editingTask.value);
        try {
          await updateDoc(taskRef, {
            text: newTask.value.trim(), // Update the task text
          });
          console.log('Task updated in Firestore:', editingTask.value);
          cancelEdit(); // Close the dialog and clear state
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    };

    // This function cancels the edit operation and closes the dialog
    const cancelEdit = () => {
      editingTask.value = null;
      newTask.value = ''; // Clear the input field
      showEditDialog.value = false;
      console.log('Edit cancelled.');
    };

    // This function handles user logout
    const handleLogout = async () => {
      try {
        await logout(); // Call logout from useAuth composable
        router.push('/login'); // Redirect to login page
        console.log('Logged out successfully.');
      } catch (err) {
        console.error('Failed to log out:', err.message);
      }
    };

    // 3. Set up watchers and lifecycle hooks (which now have access to defined functions)
    // Watch for changes in currentUser and fetch tasks accordingly
    watch(currentUser, (user) => {
      console.log('Watcher: currentUser changed to:', user ? user.email : 'null');
      if (user) {
        fetchTasks(user.uid); // Call the defined fetchTasks function with the user's UID
      } else {
        tasks.value = []; // Clear tasks if no user is logged in
      }
    }, { immediate: true }); // Run immediately on component mount if currentUser is already set


    // 4. Return everything you want to expose to the template
    return {
      // Reactive state
      newTask,
      tasks,
      editingTask,
      showEditDialog,
      isMobile,

      // Functions
      addTask,
      toggleTaskCompletion,
      removeTask,
      startEditing,
      saveEditedTask,
      cancelEdit,
      handleLogout,

      // From useAuth
      currentUser,
      authLoading,

      // Template refs for input focusing
      addTaskInput,
      editTaskInput
    };
  },
};
</script>

<style scoped>
/* Optional: Basic styling for completed tasks */
.completed-task {
  text-decoration: line-through;
  color: #888; /* Dim the text for completed tasks */
  background-color: #f0f0f0; /* Light background for completed tasks */
}
</style>