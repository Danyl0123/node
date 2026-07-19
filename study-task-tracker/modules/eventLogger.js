import EventEmitter from "node:events";
import fs from "node:fs/promises";
import path from "node:path";

const formatEventLog = (type, task) => {
  const date = new Date().toLocaleString();
  return `[${date}] | ${type} | ${task?.title ? task.title : task}`;
};

const eventEmitter = new EventEmitter();

const loggerPath = path.join(import.meta.dirname, "../data/events.log");

const logEvent = async (message) => {
  try {
    await fs.appendFile(loggerPath, message + "\n");
  } catch (err) {
    console.error("Error writing to event log:", err);
    throw err;
  }
};

eventEmitter.on("taskAdded", async (task) => {
  const logMessage = formatEventLog("taskCreated", `${task.title} was created`);
  await logEvent(logMessage);
});

eventEmitter.on("taskCompleted", async (task) => {
  const logMessage = formatEventLog(
    "taskCompleted",
    `${task.title ? task.title : task} was completed`,
  );
  await logEvent(logMessage);
});

eventEmitter.on("taskDeleted", async (task) => {
  const logMessage = formatEventLog(
    "taskDeleted",
    `${task.title ? task.title : task} was deleted`,
  );
  await logEvent(logMessage);
});

eventEmitter.on("appStarted", async () => {
  const logMessage = formatEventLog("appStarted", "Application has started");
  await logEvent(logMessage);
});

export { eventEmitter };
