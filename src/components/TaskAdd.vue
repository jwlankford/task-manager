<template>
  <div class="task-add-container">
    <input
      v-model="newTask"
      @keyup.enter="addTask"
      class="task-add-input"
      placeholder="Add a new task"
    />
    <button
      class="task-add-button"
      @mouseover="buttonHovered = true"
      @mouseleave="buttonHovered = false"
      @click="addTask"
    >
    <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTask: '',
      buttonHovered: false,
    };
  },
  methods: {
    addTask() {
      if (this.newTask.trim()) {
        this.$emit('task-added', this.newTask);
        this.newTask = '';
      }
    },
  },
};
</script>

<style scoped>
.task-add-container {
  display: flex;
  justify-content: center;
  padding: 0% 25%;
}

.task-add-input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  outline: none;
}

.task-add-button {
  background-color: rgb(78, 69, 245);
  color: white;
  padding: 0.5rem 0.5rem;
  border-radius: 0px 8px 8px 0px;
  transition: background-color 0.2s;
  border: 1px solid rgb(79, 70, 229);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.task-add-button:hover {
  background-color: rgb(125, 125, 126);
}
</style>