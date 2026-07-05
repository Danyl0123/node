import { formatTask } from "./modules/taskFormatter.js";
import {
  readTasks,
  saveTasks,
  initStorage,
  deleteTask,
  completeTask,
} from "./modules/fileStorage.js";
import { getSystemInfo } from "./modules/systemInfo.js";

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

await saveTasks([
  {
    id: "m3",
    title: "Test 2",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m4",
    title: "Test4",
    completed: false,
    createdAt: new Date().toISOString(),
  },
]);

await completeTask("m1");
await deleteTask("m2");

const tasks = await readTasks();
console.log("All tasks: ");
tasks.forEach((task) => {
  console.log(formatTask(task));
});

getSystemInfo();
