<template>
  <div>
    <h3>Task List</h3>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <p>{{ task.title }} - {{ task.deadline }}</p>
        <button @click="editTask(task.id)">Edit</button>
        <button @click="deleteTask(task.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['tasks'],
  methods: {
    editTask(id) {
      this.$emit('edit', id);
    },
    deleteTask(id) {
      this.$emit('delete', id);
    },
  },
};
</script>
