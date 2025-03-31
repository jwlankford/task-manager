<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col space-y-4">
    <div>
      <label for="taskName" class="block text-sm font-medium text-gray-700">
        Task Name
      </label>
      <input
        id="taskName"
        v-model="taskName"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        placeholder="Enter task name"
        required
      />
    </div>

    <div>
      <label for="taskDeadline" class="block text-sm font-medium text-gray-700">
        Deadline
      </label>
      <input
        id="taskDeadline"
        v-model="taskDeadline"
        type="date"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        required
      />
    </div>

    <button
      type="submit"
      class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
    >
      Add Task
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      taskName: "",
      taskDeadline: "",
    };
  },
  methods: {
    handleSubmit() {
      this.$emit("add-task", { name: this.taskName, deadline: this.taskDeadline });
      this.taskName = "";
      this.taskDeadline = "";
    },
  },
};
</script>
