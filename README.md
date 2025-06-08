# Task Manager Application

---

## Description

This is a simple Task Manager application built with **Vue.js** and **Vuetify**, designed to help you efficiently organize and track your daily tasks. You can easily add new tasks, mark them as complete, and delete them when they're no longer needed. The app provides a clean, responsive, and intuitive user interface to manage your to-do list.

This application uses **Firebase** as its backend for data storage and real-time updates.

---

## Features

* **Add Tasks:** Quickly add new tasks to your list.
* **Mark as Complete:** Toggle the completion status of tasks.
* **Delete Tasks:** Remove tasks you no longer need.
* **Persistent Storage:** All your tasks are saved and retrieved from a Firebase backend.
* **User-Friendly Interface:** Built with Vue.js and Vuetify for a modern and responsive design.

---

## Installation

To get this Task Manager application running on your local machine, follow these steps:

1.  **Clone the Repository:**
    Open your terminal or command prompt and clone the project from GitHub:
    ```bash
    git clone [https://github.com/jwlankford/task-manager.git](https://github.com/jwlankford/task-manager.git)
    cd task-manager
    ```

2.  **Install Dependencies:**
    This project uses **pnpm** as its package manager. If you don't have `pnpm` installed globally, you can install it using npm:
    ```bash
    npm install -g pnpm
    ```
    Once `pnpm` is available, navigate into the `task-manager` directory and install all the project's dependencies:
    ```bash
    pnpm install
    ```

3.  **Run the Development Server:**
    Once all dependencies are installed, start the development server:
    ```bash
    pnpm dev
    ```
    This will usually start the application on `http://localhost:5173/` (or another port if 5173 is in use). Open this URL in your web browser.

---

## How to Use the App

1.  **Adding a New Task:**
    * Look for the input field (usually at the bottom or top of the task list) labeled "Add a new task..." or something similar.
    * Type your task description into the field.
    * Press **Enter** or click the "Add Task" button (if available) to add the task to your list.

2.  **Marking a Task as Complete:**
    * Each task will have a checkbox or an icon (like a circle or an empty square) next to it.
    * Click this element to toggle the task's completion status. A completed task might look different (e.g., its text crossed out, a checkmark appearing).

3.  **Deleting a Task:**
    * Next to each task, you'll find a delete icon (like a trash can).
    * Click this icon to permanently remove the task from your list.

Your tasks will automatically save to the Firebase backend, so they'll stick around even if you close and reopen the app.
