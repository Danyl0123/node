export const taskList = [];

export const addTask = (title) => {
  const newTask = {
    id: `m${taskList.length + 1}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  taskList.push(newTask);
  console.log(`Task added: ${title}`);
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
  console.log(`Task completed: ${task.title}`);
};

export const deleteTask = (id) => {
  const task = taskList.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  taskList.splice(taskList.indexOf(task), 1);
  console.log(`Task deleted: ${task.title}`);
};
