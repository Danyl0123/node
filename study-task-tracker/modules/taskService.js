export const taskList = [];

export const addTask = (title) => {
  const newTask = {
    id: `m${taskList.length + 1}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  taskList.push(newTask);
};

export const getTasks = () => {
  return taskList;
};

export const completeTask = (id) => {
  const task = taskList.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  task.completed = true;
};

export const deleteTask = (id) => {
  const index = taskList.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  taskList.splice(index, 1);
};
