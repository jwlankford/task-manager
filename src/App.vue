<template>
  <div class="task-manager-container">
    <h1 class="task-manager-title">Task Manager</h1>
    <TaskAdd @task-added="handleTaskAdded" />
    <div class="task-list">
      <div
        v-for="(task, index) in tasks"
        :key="task.id"
        class="task-item"
      >
        <div class="task-item-content">
          <input
            type="checkbox"
            :checked="task.completed"
            @change="updateTaskCompleted({ index, completed: $event.target.checked })"
            class="task-checkbox"
          />
          <input
            v-if="editIndex === index"
            v-model="editedText"
            @keyup.enter="saveTask(index)"
            @blur="saveTask(index)"
            class="task-input"
          />
          <span v-else @click="editTask(index)" :class="{ 'task-text-completed': task.completed }" class="task-text">
            Task {{ index + 1 }}: {{ task.text }}
          </span>
        </div>
        <div class="task-item-actions">
          <button v-if="editIndex !== index" @click="deleteTask(index)" class="task-delete-button">
            <i class="fas fa-trash-alt"></i>
          </button>
          <button v-else @click="saveTask(index)" class="task-save-button">
            <i class="fas fa-save"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-if="tasks.length > 0" class="task-summary">
      <span class="remaining-tasks">{{ remainingTasks }} tasks remaining</span>
      <a v-if="completedTasks > 0" @click="clearCompleted" class="clear-completed-button">
        Clear Completed
      </a>
    </div>
    <div v-else class="no-tasks">
      No tasks yet!
    </div>
  </div>
</template>

<script>
import TaskAdd from './components/TaskAdd.vue';
import { db } from '@/firebase'; // Import your Firebase instance

export default {
  components: {
    TaskAdd,
  },
  data() {
    return {
      tasks: [],
      editIndex: null,
      editedText: '',
    };
  },
  mounted() {
    this.fetchTasks();
  },
  computed: {
    remainingTasks() {
      return this.tasks.filter((task) => !task.completed).length;
    },
    completedTasks() {
      return this.tasks.filter((task) => task.completed).length;
    },
  },
  methods: {
    async fetchTasks() {
      try {
        const snapshot = await db.collection('tasks').get(); // For Firestore
        // For Realtime Database: db.ref('tasks').once('value')
        this.tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // For Firestore
        // For Realtime Database: Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async addTask(taskText) {
      try {
        await db.collection('tasks').add({ text: taskText }); // For Firestore
        // For Realtime Database: db.ref('tasks').push({ text: taskText });
        this.fetchTasks(); // Refresh tasks after adding
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async deleteTask(taskId) {
      try {
        await db.collection('tasks').doc(taskId).delete(); // For Firestore
        // For Realtime Database: db.ref(`tasks/${taskId}`).remove();
        this.fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    handleTaskAdded(newTaskText) {
      this.tasks.push({ text: newTaskText, completed: false });
    },
    clearCompleted() {
      this.tasks = this.tasks.filter((task) => !task.completed);
    },
    updateTaskCompleted(payload) {
      this.tasks[payload.index].completed = payload.completed;
    },
    editTask(index) {
      this.editIndex = index;
      this.editedText = this.tasks[index].text;
    },
    saveTask(index) {
      if (this.editedText.trim()) {
        this.tasks[index].text = this.editedText;
      }
      this.editIndex = null;
    },
  },
};
</script>

<style>
.task-manager-container {
  position: relative;
  padding: 48px 32px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
}

.task-manager-title {
  font-size: 24px;
  font-weight: bold;
  color: indigo;
  text-align: center;
  margin-bottom: 32px;
}

.task-list {
  /* Remove display: flex; and justify-content: center; */
  padding: 0% 25%;
}

.task-item {
  display: flex;
  background-color: rgb(230, 232, 234);
  align-items: center;
  justify-content: space-between;
  padding: 15px 0px;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 8px;
  border-bottom: 1px solid #ccc; /* Add a bottom border */
  padding-bottom: 5px; /* Add some padding below the text */
  margin-bottom: 5px; /* Add some margin below the div */
}

.task-item-content {
  display: flex;
  align-items: center;
}

.task-checkbox {
  margin-right: 16px;
  width: 20px;
  height: 20px;
  color: indigo;
}

.task-input {
  width:250px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px;
  outline: none;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.5);
}

.task-text {
  font-size: 16px;
  width: 275px;
}

.task-text-completed {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-item-actions {
  display: flex;
  align-items: center;
}

.task-delete-button {
  transition: background-color 0.5s;
}

.task-save-button {
  transition: background-color 0.5s;
}

.task-summary {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding: 0% 25%;
}

.remaining-tasks {
  font-size: 16px;
  color: #4b5563;
  font-weight: medium;
}

.clear-completed-button {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.no-tasks {
  text-align: center;
  margin-top: 32px;
  color: #6b7280;
  font-size: 16px;
  font-weight: medium;
}
</style>