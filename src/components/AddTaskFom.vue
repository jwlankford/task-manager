<template>
    <form @submit.prevent="addTask">
      <input v-model="title" type="text" placeholder="Task Title" required />
      <input v-model="deadline" type="date" required />
      <button type="submit">Add Task</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: '',
        deadline: '',
      };
    },
    methods: {
      addTask() {
        const newTask = {
          id: Date.now(),
          title: this.title,
          deadline: this.deadline,
        };
        this.$emit('add', newTask);
        this.title = '';
        this.deadline = '';
      },
    },
  };
  </script>
  