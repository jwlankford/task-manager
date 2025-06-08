import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomeView from "@/views/HomeView.vue";

// Mock external dependencies
vi.mock("vuetify", () => ({
  useDisplay: vi.fn(() => ({
    mobile: {
      value: false
    }
  })),
}));

vi.mock("@/composables/useThemeMode", () => ({
  useThemeMode: vi.fn(() => ({
    currentTheme: vi.ref("light"),
    toggleTheme: vi.fn(),
  })),
}));

// Mock Firebase
const mockCollection = vi.fn();
const mockOnSnapshot = vi.fn();
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockDoc = vi.fn();
const mockQuery = vi.fn();
const mockOrderBy = vi.fn();
const mockWhere = vi.fn();

vi.mock("@/firebaseConfig", () => ({
  db: {}, // Mock db object
  auth: {}, // Mock auth object
  collection: mockCollection,
  onSnapshot: mockOnSnapshot,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  query: mockQuery,
  orderBy: mockOrderBy,
  where: mockWhere,
}));

// Mock Vue Router
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

// Mock useAuth composable
const mockCurrentUser = vi.ref(null);
const mockAuthLoading = vi.ref(false);
const mockLogout = vi.fn();

vi.mock("@/composables/useAuth", () => ({
  useAuth: vi.fn(() => ({
    currentUser: mockCurrentUser,
    authLoading: mockAuthLoading,
    logout: mockLogout,
  })),
}));

describe("HomeView.vue", () => {
  let snapshotCallback; // To hold the callback passed to onSnapshot

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock data
    mockCurrentUser.value = { uid: "test-user-id", email: "test@example.com" };
    mockAuthLoading.value = false;
    mockPush.mockResolvedValueOnce(undefined);
    mockLogout.mockResolvedValueOnce(undefined);

    // Mock onSnapshot to immediately capture the callback
    mockOnSnapshot.mockImplementation((q, callback) => {
      snapshotCallback = callback;
      return () => {}; // Return an unsubscribe function
    });

    // Mock Firebase query chain
    mockQuery.mockReturnValue("mock-query");
    mockWhere.mockReturnValue("mock-where-query");
    mockOrderBy.mockReturnValue("mock-ordered-query");
  });

  const mountComponent = () =>
    shallowMount(HomeView, {
      global: {
        stubs: {
          // Stub Vuetify components to avoid deep rendering issues and focus on logic
          "v-main": true,
          "v-container": true,
          "v-card": true,
          "v-card-title": true,
          "v-card-text": true,
          "v-row": true,
          "v-col": true,
          "v-text-field": true,
          "v-btn": true,
          "v-list": true,
          "v-list-item": true,
          "v-list-item-action": true,
          "v-checkbox-btn": true,
          "v-list-item-title": true,
          "v-navigation-drawer": true,
          "v-dialog": true,
          "v-card-actions": true,
          "v-app-bar-nav-icon": true,
          "v-icon": true,
        },
      },
    });

  it("renders the main title", () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain("My Task Manager");
  });

  it("displays 'Add a new task' input field", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "v-text-field", props: { label: "Add a new task" } }).exists()).toBe(true);
  });

  it("calls fetchTasks with current user ID on mount", () => {
    mountComponent();
    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "test-user-id");
    expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "asc");
    expect(mockOnSnapshot).toHaveBeenCalled();
  });

  it("does not call fetchTasks if no user is logged in initially", async () => {
    mockCurrentUser.value = null; // Set no user
    mountComponent();
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("adds a new task when Add Task button is clicked", async () => {
    const wrapper = mountComponent();
    const taskInput = wrapper.findComponent({ name: "v-text-field", props: { label: "Add a new task" } });
    const addButton = wrapper.findComponent({ name: "v-btn", text: "Add Task" });

    await taskInput.setValue("New Test Task");
    await addButton.trigger("click");

    expect(mockAddDoc).toHaveBeenCalledWith(expect.any(Object), {
      text: "New Test Task",
      completed: false,
      createdAt: expect.any(Date),
      userId: "test-user-id",
    });
    expect(wrapper.vm.newTask).toBe(""); // Input should be cleared
  });

  it("does not add a task if the input is empty", async () => {
    const wrapper = mountComponent();
    const taskInput = wrapper.findComponent({ name: "v-text-field", props: { label: "Add a new task" } });
    const addButton = wrapper.findComponent({ name: "v-btn", text: "Add Task" });

    await taskInput.setValue("");
    await addButton.trigger("click");

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it("does not add a task if no user is logged in", async () => {
    mockCurrentUser.value = null;
    const wrapper = mountComponent();
    const taskInput = wrapper.findComponent({ name: "v-text-field", props: { label: "Add a new task" } });
    const addButton = wrapper.findComponent({ name: "v-btn", text: "Add Task" });

    await taskInput.setValue("Task for no user");
    await addButton.trigger("click");

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it("toggles task completion", async () => {
    const wrapper = mountComponent();
    // Simulate a Firebase snapshot update with tasks
    snapshotCallback({
      forEach: (cb) => {
        cb({ id: "task1", data: () => ({ text: "Task 1", completed: false, userId: "test-user-id" }) });
      },
    });
    await wrapper.vm.$nextTick(); // Wait for Vue to update the DOM

    const checkbox = wrapper.findComponent({ name: "v-checkbox-btn" });
    expect(checkbox.props("modelValue")).toBe(false); // Initially false

    await checkbox.trigger("click");

    expect(mockUpdateDoc).toHaveBeenCalledWith(expect.any(Object), { completed: true });
    expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "tasks", "task1");
  });

  it("removes a task", async () => {
    const wrapper = mountComponent();
    // Simulate a Firebase snapshot update with tasks
    snapshotCallback({
      forEach: (cb) => {
        cb({ id: "task1", data: () => ({ text: "Task 1", completed: false, userId: "test-user-id" }) });
      },
    });
    await wrapper.vm.$nextTick();

    const deleteButton = wrapper.findComponent({ name: "v-btn", props: { icon: "mdi-delete" } });
    await deleteButton.trigger("click");

    expect(mockDeleteDoc).toHaveBeenCalledWith(expect.any(Object));
    expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "tasks", "task1");
  });

  it("starts editing a task", async () => {
    const wrapper = mountComponent();
    // Simulate a Firebase snapshot update with tasks
    snapshotCallback({
      forEach: (cb) => {
        cb({ id: "task1", data: () => ({ text: "Task to edit", completed: false, userId: "test-user-id" }) });
      },
    });
    await wrapper.vm.$nextTick();

    const editButton = wrapper.findComponent({ name: "v-btn", props: { icon: "mdi-pencil" } });
    await editButton.trigger("click");

    expect(wrapper.vm.showEditDialog).toBe(true);
    expect(wrapper.vm.newTask).toBe("Task to edit");
    expect(wrapper.vm.editingTask).toBe("task1");
  });

  it("saves edited task", async () => {
    const wrapper = mountComponent();
    wrapper.vm.editingTask = "task1"; // Manually set editing state
    wrapper.vm.newTask = "Updated Task";
    wrapper.vm.showEditDialog = true; // Open dialog

    const saveButton = wrapper.findComponent({ name: "v-btn", text: "Save" });
    await saveButton.trigger("click");

    expect(mockUpdateDoc).toHaveBeenCalledWith(expect.any(Object), { text: "Updated Task" });
    expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "tasks", "task1");
    expect(wrapper.vm.showEditDialog).toBe(false);
    expect(wrapper.vm.newTask).toBe("");
    expect(wrapper.vm.editingTask).toBe(null);
  });

  it("cancels task editing", async () => {
    const wrapper = mountComponent();
    wrapper.vm.editingTask = "task1";
    wrapper.vm.newTask = "Unsaved task";
    wrapper.vm.showEditDialog = true;

    const cancelButton = wrapper.findComponent({ name: "v-btn", text: "Cancel" });
    await cancelButton.trigger("click");

    expect(wrapper.vm.showEditDialog).toBe(false);
    expect(wrapper.vm.newTask).toBe("");
    expect(wrapper.vm.editingTask).toBe(null);
  });

  it("handles logout and navigates to login page", async () => {
    const wrapper = mountComponent();
    const logoutButton = wrapper.findComponent({ name: "v-btn", props: { icon: "mdi-logout" } });
    await logoutButton.trigger("click");

    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("toggles theme when theme button is clicked", async () => {
    const wrapper = mountComponent();
    const toggleThemeBtn = wrapper.findComponent({ props: { title: "Toggle Dark Mode" } });
    await toggleThemeBtn.trigger("click");

    expect(wrapper.vm.toggleTheme).toHaveBeenCalled();
  });

  describe("Mobile responsiveness", () => {
    beforeEach(() => {
      vi.mock("vuetify", async (importOriginal) => {
        const original = await importOriginal();
        return {
          ...original,
          useDisplay: vi.fn(() => ({
            mobile: {
              value: true
            }
          })),
        };
      });
      // Re-import HomeView after mocking useDisplay for mobile to apply the mock
      vi.doMock("@/views/HomeView.vue", async (importOriginal) => {
        const actual = await importOriginal();
        return actual;
      });
    });

    afterEach(() => {
      // Restore original mock for useDisplay to avoid affecting other tests
      vi.doMock("vuetify", async (importOriginal) => {
        const original = await importOriginal();
        return {
          ...original,
          useDisplay: vi.fn(() => ({
            mobile: {
              value: false
            }
          })),
        };
      });
      vi.doMock("@/views/HomeView.vue", async (importOriginal) => {
        const actual = await importOriginal();
        return actual;
      });
    });

    it("shows navigation drawer icon on mobile", async () => {
      const { default: MobileHomeView } = await import("@/views/HomeView.vue");
      const wrapper = shallowMount(MobileHomeView, {
        global: {
          stubs: {
            "v-main": true,
            "v-container": true,
            "v-card": true,
            "v-card-title": true,
            "v-card-text": true,
            "v-row": true,
            "v-col": true,
            "v-text-field": true,
            "v-btn": true,
            "v-list": true,
            "v-list-item": true,
            "v-list-item-action": true,
            "v-checkbox-btn": true,
            "v-list-item-title": true,
            "v-navigation-drawer": true,
            "v-dialog": true,
            "v-card-actions": true,
            "v-app-bar-nav-icon": true,
            "v-icon": true,
          },
        },
      });
      expect(wrapper.findComponent({ props: { "aria-label": "Open menu" } }).exists()).toBe(true);
      expect(wrapper.findComponent({ props: { icon: "mdi-logout" } }).exists()).toBe(false); // Desktop logout button should be hidden
    });

    it("opens navigation drawer when menu icon is clicked", async () => {
      const { default: MobileHomeView } = await import("@/views/HomeView.vue");
      const wrapper = shallowMount(MobileHomeView, {
        global: {
          stubs: {
            "v-main": true,
            "v-container": true,
            "v-card": true,
            "v-card-title": true,
            "v-card-text": true,
            "v-row": true,
            "v-col": true,
            "v-text-field": true,
            "v-btn": true,
            "v-list": true,
            "v-list-item": true,
            "v-list-item-action": true,
            "v-checkbox-btn": true,
            "v-list-item-title": true,
            "v-navigation-drawer": true,
            "v-dialog": true,
            "v-card-actions": true,
            "v-app-bar-nav-icon": true,
            "v-icon": true,
          },
        },
      });

      const menuIcon = wrapper.findComponent({ props: { "aria-label": "Open menu" } });
      await menuIcon.trigger("click");
      expect(wrapper.vm.drawerVisible).toBe(true);
    });

    it("toggles theme and closes drawer on mobile", async () => {
      const { default: MobileHomeView } = await import("@/views/HomeView.vue");
      const wrapper = shallowMount(MobileHomeView, {
        global: {
          stubs: {
            "v-main": true,
            "v-container": true,
            "v-card": true,
            "v-card-title": true,
            "v-card-text": true,
            "v-row": true,
            "v-col": true,
            "v-text-field": true,
            "v-btn": true,
            "v-list": true,
            "v-list-item": true,
            "v-list-item-action": true,
            "v-checkbox-btn": true,
            "v-list-item-title": true,
            "v-navigation-drawer": true,
            "v-dialog": true,
            "v-card-actions": true,
            "v-app-bar-nav-icon": true,
            "v-icon": true,
          },
        },
      });

      wrapper.vm.drawerVisible = true; // Open drawer
      await wrapper.findComponent({ props: { title: "Toggle Dark Mode" } }).trigger("click");

      expect(wrapper.vm.toggleTheme).toHaveBeenCalled();
      expect(wrapper.vm.drawerVisible).toBe(false);
    });

    it("handles logout and closes drawer on mobile", async () => {
      const { default: MobileHomeView } = await import("@/views/HomeView.vue");
      const wrapper = shallowMount(MobileHomeView, {
        global: {
          stubs: {
            "v-main": true,
            "v-container": true,
            "v-card": true,
            "v-card-title": true,
            "v-card-text": true,
            "v-row": true,
            "v-col": true,
            "v-text-field": true,
            "v-btn": true,
            "v-list": true,
            "v-list-item": true,
            "v-list-item-action": true,
            "v-checkbox-btn": true,
            "v-list-item-title": true,
            "v-navigation-drawer": true,
            "v-dialog": true,
            "v-card-actions": true,
            "v-app-bar-nav-icon": true,
            "v-icon": true,
          },
        },
      });

      wrapper.vm.drawerVisible = true; // Open drawer
      await wrapper.findComponent({ props: { title: "Logout" } }).trigger("click");

      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(wrapper.vm.drawerVisible).toBe(false);
    });
  });

  it("displays 'No tasks yet!' when tasks array is empty", async () => {
    const wrapper = mountComponent();
    snapshotCallback({
      forEach: () => {}, // Simulate empty snapshot
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("No tasks yet! Add one above.");
  });

  it("updates tasks when Firebase snapshot changes", async () => {
    const wrapper = mountComponent();
    snapshotCallback({
      forEach: (cb) => {
        cb({ id: "task-1", data: () => ({ text: "First Task", completed: false, userId: "test-user-id" }) });
        cb({ id: "task-2", data: () => ({ text: "Second Task", completed: true, userId: "test-user-id" }) });
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.tasks).toEqual([
      { id: "task-1", text: "First Task", completed: false, userId: "test-user-id" },
      { id: "task-2", text: "Second Task", completed: true, userId: "test-user-id" },
    ]);

    expect(wrapper.findAllComponents({ name: "v-list-item" }).length).toBe(2);
    expect(wrapper.html()).toContain("First Task");
    expect(wrapper.html()).toContain("Second Task");
  });

  it("applies 'completed-task' class for completed tasks", async () => {
    const wrapper = mountComponent();
    snapshotCallback({
      forEach: (cb) => {
        cb({ id: "task-1", data: () => ({ text: "Completed Task", completed: true, userId: "test-user-id" }) });
      },
    });
    await wrapper.vm.$nextTick();

    const listItem = wrapper.findComponent({ name: "v-list-item" });
    expect(listItem.classes()).toContain("completed-task");
  });
});