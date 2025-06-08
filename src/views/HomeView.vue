<template>
  <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
    <v-container class="max-w-md">
      <v-card class="pa-6 rounded-xl elevation-12">
        <v-card-title
          class="d-flex justify-space-between align-center text-h4 text-center text-green-darken-3 font-weight-bold mb-6"
        >
          <v-app-bar-nav-icon
            v-if="isMobile"
            @click.stop="drawerVisible = !drawerVisible"
            aria-label="Open menu"
            class="mr-2"
          ></v-app-bar-nav-icon>

          My Task Manager

          <div class="d-flex align-center">
            <v-btn
              v-if="!isMobile"
              icon
              variant="text"
              color="primary"
              @click="toggleTheme"
              :title="`Toggle ${
                currentTheme === 'light' ? 'Dark' : 'Light'
              } Mode`"
              class="mr-2"
            >
              <v-icon>{{
                currentTheme === "light"
                  ? "mdi-moon-waning-gibbous"
                  : "mdi-white-balance-sunny"
              }}</v-icon>
            </v-btn>

            <v-btn
              v-if="!isMobile"
              icon="mdi-logout"
              variant="text"
              color="red-darken-1"
              @click="handleLogout"
              title="Logout"
            ></v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-row no-gutters class="mb-6 align-center">
            <v-col cols="12" sm="9" class="pr-sm-2">
              <v-text-field
                v-model="newTask"
                label="Add a new task"
                variant="outlined"
                clearable
                hide-details
                density="compact"
                @keyup.enter="addTask"
                ref="addTaskInput"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" class="mt-4 mt-sm-0 pl-sm-2">
              <v-btn
                :color="currentTheme === 'dark' ? 'success' : 'green-darken-3'"
                variant="elevated"
                block
                @click="addTask"
                :disabled="!newTask.trim()"
              >
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
                    <v-checkbox-btn
                      :model-value="task.completed"
                      @click.stop="toggleTaskCompletion(task)"
                    ></v-checkbox-btn>
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
                <v-list-item-title
                  >No tasks yet! Add one above.</v-list-item-title
                >
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>

  <v-navigation-drawer
    v-if="isMobile"
    v-model="drawerVisible"
    temporary
    location="right"
    width="250"
  >
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-theme-light-dark"
        :title="`Toggle ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`"
        @click="toggleThemeAndCloseDrawer"
        color="primary"
      >
        <template v-slot:append>
          <v-icon>{{
            currentTheme === "light"
              ? "mdi-moon-waning-gibbous"
              : "mdi-white-balance-sunny"
          }}</v-icon>
        </template>
      </v-list-item>

      <v-list-item
        prepend-icon="mdi-logout"
        title="Logout"
        @click="handleLogoutAndCloseDrawer"
        color="red-darken-1"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-dialog
    v-model="showEditDialog"
    :fullscreen="isMobile"
    :scrim="!isMobile"
    max-width="500px"
    transition="dialog-bottom-transition"
  >
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
          class="mb-4"
        ></v-text-field>
        <v-btn
          color="success"
          variant="elevated"
          block
          @click="saveEditedTask"
          class="mb-4"
          >Save</v-btn
        >
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" variant="text" @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, nextTick, watch } from "vue";
import { useDisplay } from "vuetify";

// Import new composable
import { useThemeMode } from "@/composables/useThemeMode";

import { db, auth } from "@/firebaseConfig";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

export default {
  name: "HomeView",
  setup() {
    const { currentUser, authLoading, logout } = useAuth();
    const router = useRouter();

    const newTask = ref("");
    const tasks = ref([]);
    const editingTask = ref(null);
    const showEditDialog = ref(false);

    const addTaskInput = ref(null);
    const editTaskInput = ref(null);

    const drawerVisible = ref(false);

    const isMobile = computed(() => {
      return useDisplay().mobile.value;
    });

    // Use the new theme composable
    const { currentTheme, toggleTheme } = useThemeMode();

    const fetchTasks = (userId) => {
      console.log("fetchTasks function DEFINITION called with userId:", userId);

      if (!userId) {
        console.warn("fetchTasks called with no userId, clearing tasks.");
        tasks.value = [];
        return;
      }

      const q = query(
        collection(db, "tasks"),
        where("userId", "==", userId),
        orderBy("createdAt", "asc")
      );

      onSnapshot(
        q,
        (snapshot) => {
          console.log("onSnapshot listener triggered!");
          const firebaseTasks = [];
          snapshot.forEach((doc) => {
            const taskData = { id: doc.id, ...doc.data() };
            firebaseTasks.push(taskData);
            console.log("  - Added task from Firestore:", taskData);
          });
          tasks.value = firebaseTasks;
          console.log("Tasks array updated. Current tasks:", tasks.value);
        },
        (error) => {
          console.error("Error in onSnapshot listener:", error);
        }
      );
    };

    const addTask = async () => {
      console.log("addTask function called!");
      console.log("newTask value:", newTask.value);
      console.log("currentUser value:", currentUser.value);

      if (newTask.value.trim() === "") {
        console.warn("Task input is empty, not adding.");
        return;
      }

      if (!currentUser.value) {
        console.warn("No user logged in, cannot add task.");
        return;
      }

      try {
        await addDoc(collection(db, "tasks"), {
          text: newTask.value.trim(),
          completed: false,
          createdAt: new Date(),
          userId: currentUser.value.uid,
        });
        newTask.value = "";
        console.log("Task added successfully to Firestore!");
      } catch (error) {
        console.error("Error adding document to Firestore: ", error);
      }
    };

    const toggleTaskCompletion = async (task) => {
      const taskRef = doc(db, "tasks", task.id);
      try {
        await updateDoc(taskRef, {
          completed: !task.completed,
        });
        console.log("Task completion toggled in Firestore for:", task.id);
      } catch (error) {
        console.error("Error updating task completion: ", error);
      }
    };

    const removeTask = async (id) => {
      const taskRef = doc(db, "tasks", id);
      try {
        await deleteDoc(taskRef);
        console.log("Task removed from Firestore:", id);
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    };

    const startEditing = (task) => {
      editingTask.value = task.id;
      newTask.value = task.text;
      showEditDialog.value = true;
      nextTick(() => {
        if (editTaskInput.value) {
          editTaskInput.value.focus();
        }
      });
    };

    const saveEditedTask = async () => {
      if (newTask.value.trim() === "") {
        console.warn("Task cannot be empty. Edit cancelled.");
        cancelEdit();
        return;
      }

      if (editingTask.value) {
        const taskRef = doc(db, "tasks", editingTask.value);
        try {
          await updateDoc(taskRef, {
            text: newTask.value.trim(),
          });
          console.log("Task updated in Firestore:", editingTask.value);
          cancelEdit();
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    };

    const cancelEdit = () => {
      editingTask.value = null;
      newTask.value = "";
      showEditDialog.value = false;
      console.log("Edit cancelled.");
    };

    const handleLogout = async () => {
      try {
        await logout();
        router.push("/login");
        console.log("Logged out successfully.");
      } catch (err) {
        console.error("Failed to log out:", err.message);
      }
    };

    const handleLogoutAndCloseDrawer = async () => {
      await handleLogout();
      drawerVisible.value = false;
    };

    // New: Function to toggle theme and close drawer (for mobile)
    const toggleThemeAndCloseDrawer = () => {
      toggleTheme(); // Call the theme toggle logic
      drawerVisible.value = false; // Close the drawer
    };

    watch(
      currentUser,
      (user) => {
        console.log(
          "Watcher: currentUser changed to:",
          user ? user.email : "null"
        );
        if (user) {
          fetchTasks(user.uid);
        } else {
          tasks.value = [];
        }
      },
      { immediate: true }
    );

    return {
      newTask,
      tasks,
      editingTask,
      showEditDialog,
      isMobile,
      drawerVisible,

      // Expose theme-related values and function
      currentTheme,
      toggleTheme,

      addTask,
      toggleTaskCompletion,
      removeTask,
      startEditing,
      saveEditedTask,
      cancelEdit,
      handleLogout,
      handleLogoutAndCloseDrawer,
      toggleThemeAndCloseDrawer, // Expose for mobile drawer

      currentUser,
      authLoading,

      addTaskInput,
      editTaskInput,
    };
  },
};
</script>

<style scoped>
.completed-task {
  text-decoration: line-through;
  color: #888;
  background-color: #f0f0f0;
}
</style>
