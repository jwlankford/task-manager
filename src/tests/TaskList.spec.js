import { mount } from '@vue/test-utils';
import TaskList from '@/components/TaskList.vue';

describe('TaskList.vue', () => {
  let wrapper;
  const tasks = [
    { id: 1, title: 'Learn Vue', deadline: '2025-03-30' },
    { id: 2, title: 'Build a project', deadline: '2025-04-05' },
  ];

  beforeEach(() => {
    wrapper = mount(TaskList, {
      props: {
        tasks,
      },
    });
  });

  it('renders the correct number of tasks', () => {
    const taskItems = wrapper.findAll('.task-item');
    expect(taskItems.length).toBe(2);
  });

  it('emits an edit event when clicking edit', async () => {
    const taskToEdit = tasks[0];
    await wrapper.findAll('button.edit-btn')[0].trigger('click');

    expect(wrapper.emitted().edit[0]).toEqual([taskToEdit]);
  });

  it('emits a delete event when clicking delete', async () => {
    const taskToDeleteId = tasks[0].id;
    await wrapper.findAll('button.delete-btn')[0].trigger('click');

    expect(wrapper.emitted().delete[0]).toEqual([taskToDeleteId]);
  });
});
