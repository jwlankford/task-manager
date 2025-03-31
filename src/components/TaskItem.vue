<template>
    <div class="flex items-center justify-between p-4 border-b border-gray-200 rounded-lg">
      <div class="flex items-center">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleCompleted"
          class="mr-4 form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500"
        />
        <span :class="{ 'line-through text-gray-400': task.completed }" class="flex-grow text-lg font-medium">
          {{ task.text }}
        </span>
      </div>
      <button
        @click="deleteItem"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Delete
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      task: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
    methods: {
      deleteItem() {
        this.$emit('delete-task', this.index);
      },
      toggleCompleted(event) {
        this.$emit('update-completed', { index: this.index, completed: event.target.checked });
      },
    },
  };
  </script>