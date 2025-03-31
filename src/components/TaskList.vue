<template>
  <ul class="divide-y divide-gray-200">
    <li
      v-for="(task, index) in tasks"
      :key="index"
      class="flex justify-between items-center py-4"
    >
      <span class="text-gray-800">{{ task.name }}</span>
      <span class="text-gray-500 text-sm">{{ task.deadline }}</span>
      <button
        @click="removeTask(index)"
        class="py-1 px-3 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:ring focus:ring-red-300"
      >
        Remove
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      default: () => [], // Default to an empty array
    },
  },
  methods: {
    removeTask(index) {
      this.$emit("remove-task", index);
    },
  },
};
</script>
