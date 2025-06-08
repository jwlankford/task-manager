# Task Manager Application

---

## Description

This is a modern and intuitive **Task Manager application** built with **Vue.js 3** and **Vuetify 3**. It's designed to help you efficiently organize and track your daily tasks with robust authentication and a customizable user experience.

The application uses **Firebase** as its backend for secure user authentication (Email/Password, Google Sign-in) and real-time data storage (Firestore) to ensure all your tasks are persistent and accessible across sessions.

---

## Features

* **User Authentication:**
    * **Email & Password:** Securely register and log in to your account.
    * **Google Sign-in:** Quick and easy authentication using your Google account.
* **Task Management:**
    * **Add Tasks:** Quickly add new tasks to your personalized list.
    * **Mark as Complete:** Toggle the completion status of tasks.
    * **Edit Tasks:** Modify existing task descriptions via a responsive overlay dialog, which is full-screen on mobile for an optimal experience.
    * **Delete Tasks:** Permanently remove tasks you no longer need.
* **Real-time Data:** All your tasks are synchronized in real-time with Firebase Firestore.
* **Responsive Design:** Built with Vuetify for a clean, modern, and adaptive user interface across all devices (desktop, tablet, mobile).
* **Password Visibility Toggle:** Easily show/hide password text on login and registration forms for improved usability and security.
* **Dark/Light Mode:**
    * Toggle between dark and light themes with a dedicated button.
    * Automatically detects and applies your operating system's preferred theme on initial load.
    * Persists your chosen theme preference across sessions using local storage.
* **Mobile-Friendly Navigation:** Logout functionality is integrated into a slide-out navigation drawer on mobile viewports for easy access.


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

Upon launching the application, you'll be redirected to the **Login** page.

1.  **Registering a New Account:**
    * On the Login page, click the "Register Here" button.
    * Enter your desired email and password. Use the **eye icon** to toggle password visibility.
    * Alternatively, click "Sign up with Google" for quick registration/login.
    * Click "Register" or complete the Google sign-in process. You'll be redirected to the main Task Manager.

2.  **Logging In:**
    * Enter your registered email and password. Use the **eye icon** to toggle password visibility.
    * Alternatively, click "Sign in with Google" to log in with your Google account.
    * Click "Log In" or complete the Google sign-in process. You'll be redirected to the main Task Manager.

3.  **Adding a New Task:**
    * Type your task description into the "Add a new task..." field.
    * Press **Enter** or click the "Add Task" button. The task will instantly appear in your list.

4.  **Marking a Task as Complete:**
    * Click the **checkbox** next to any task to toggle its completion status. Completed tasks will appear visually different (e.g., text crossed out).

5.  **Editing a Task:**
    * Click the **pencil icon** next to the task you wish to edit.
    * An overlay dialog will appear (full-screen on mobile).
    * Modify the task description in the input field.
    * Click the "Save" button to apply changes, or "Cancel" to discard.

6.  **Deleting a Task:**
    * Click the **trash can icon** next to the task you want to remove. The task will be permanently deleted from your list.

7.  **Toggling Dark/Light Mode:**
    * **Desktop:** Click the **moon/sun icon** next to "My Task Manager" title to switch between dark and light themes.
    * **Mobile:** Click the **hamburger menu icon** (three lines) next to "My Task Manager" title. In the slide-out menu, click the "Toggle Dark/Light Mode" option.
    * Your preference will be saved for future visits.

8.  **Logging Out:**
    * **Desktop:** Click the **red logout icon** next to "My Task Manager" title.
    * **Mobile:** Click the **hamburger menu icon**, then select "Logout" from the slide-out menu.

---
