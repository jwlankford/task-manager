import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import AddTaskForm from '@/components/AddTaskForm.vue'; // Keep this if needed for testing

describe('App.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App);
  });

  it('renders AddTaskForm when adding a task', async () => {
    // Simulate showing the Add Task form
    wrapper.vm.showAddTaskForm();
    await wrapper.vm.$nextTick(); // Wait for DOM updates

    // Check if AddTaskForm is rendered
    const addTaskForm = wrapper.findComponent(AddTaskForm);
    expect(addTaskForm.exists()).toBe(true);
  });
});
