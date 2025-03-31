<template>
    <div class="h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header class="text-4xl font-bold text-blue-600 mb-6">
        Task Manager
      </header>
      <main class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <add-task-form class="mb-6"></add-task-form>
        <task-list></task-list>
      </main>
    </div>
  </template>
  
  <script>
  import AddTaskForm from '@/components/AddTaskForm.vue';
  import TaskList from '@/components/TaskList.vue';
  
  export default {
    components: {
      AddTaskForm,
      TaskList,
    },
  };
  </script>
  