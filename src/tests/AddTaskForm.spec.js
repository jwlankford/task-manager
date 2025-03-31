import { mount } from '@vue/test-utils';
import AddTaskForm from '@/components/AddTaskForm.vue';

describe('AddTaskForm.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AddTaskForm, {
      props: {
        task: null,
      },
    });
  });

  it('emits an add event with correct data when submitting a new task', async () => {
    // Fill out the form
    await wrapper.find('input[type="text"]').setValue('New Task');
    await wrapper.find('input[type="date"]').setValue('2025-04-01');
    await wrapper.find('form').trigger('submit.prevent');

    // Check the emitted event
    expect(wrapper.emitted().add[0][0]).toEqual({
      id: expect.any(Number),
      title: 'New Task',
      deadline: '2025-04-01',
    });
  });

  it('prefills the form fields when editing a task', async () => {
    const task = { id: 1, title: 'Edit Me', deadline: '2025-03-31' };
    await wrapper.setProps({ task });

    expect(wrapper.find('input[type="text"]').element.value).toBe(task.title);
    expect(wrapper.find('input[type="date"]').element.value).toBe(task.deadline);
  });
});
