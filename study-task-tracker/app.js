import {
  addTask,
  deleteTask,
  getTasks,
  completeTask,
} from "./modules/taskService.js";
import { formatTask } from "./modules/taskFormatter.js";

addTask("Learn Node.js modules");
addTask("Check out the new features in Node.js 20");
addTask("Build a simple Node.js application");

console.log("All tasks: ");
getTasks().forEach((task) => {
  console.log(formatTask(task));
});

completeTask("m1");

deleteTask("m2");

console.log("After completing task m1 and deleting task m2:");
getTasks().forEach((task) => {
  console.log(formatTask(task));
});
