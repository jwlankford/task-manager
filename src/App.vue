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
      <li v-for="(task, index) in tasks" :key="index" :class="{ completed: task.completed }">
        <input type="checkbox" v-model="task.completed" />
        <span>{{ task.text }}</span>
        <button @click="removeTask(index)">Remove</button>
        <p>test</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: [
        { text: 'Learn Vue.js', completed: false },
        { text: 'Build a task manager', completed: true },
        { text: 'Deploy the app', completed: false },
      ],
    };
  },
  methods: {
    addTask() {
      if (this.newTask.trim() !== '') {
        this.tasks.push({ text: this.newTask.trim(), completed: false });
        this.newTask = '';
      }
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
    },
  },
};
</script>

<style>
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