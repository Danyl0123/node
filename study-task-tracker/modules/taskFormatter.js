export const formatTask = (task) => {
  return `[${task.completed ? "x" : " "}] ${task.title} (created at: ${new Date(task.createdAt).toLocaleString()})`;
};
