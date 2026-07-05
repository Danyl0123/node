import { formatTask } from "./modules/taskFormatter.js";
import { readTasks, saveTasks, initStorage } from "./modules/fileStorage.js";

await initStorage();

await saveTasks([
  {
    id: "m1",
    title: "Learn Node.js modules",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    title: "Check out the new features in Node.js 20",
    completed: false,
    createdAt: new Date().toISOString(),
  },
]);

const tasks = await readTasks();
console.log("All tasks: ");
tasks.forEach((task) => {
  console.log(formatTask(task));
});
