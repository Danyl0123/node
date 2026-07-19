import path from "path";
import fs from "fs/promises";
import { eventEmitter } from "./eventLogger.js";
import crypto from "crypto";

export const readTasks = async () => {
  const pathToFile = path.join(import.meta.dirname, "../data/tasks.json");
  try {
    const data = await fs.readFile(pathToFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading tasks:", err);
    throw err;
  }
};

export const saveTasks = async (tasks) => {
  const pathToFile = path.join(import.meta.dirname, "../data/tasks.json");
  try {
    const data = await fs.readFile(pathToFile, "utf-8");
    const existingTasks = JSON.parse(data);
    const tasksWithHash = tasks.map((task) => ({
      ...task,
      hash: crypto
        .createHash("sha256")
        .update(task.title + task.createdAt + task.title)
        .digest("hex"),
    }));
    const updatedTasks = [...existingTasks, ...tasksWithHash];
    await fs.writeFile(pathToFile, JSON.stringify(updatedTasks, null, 2));
    tasks.forEach((task) => {
      eventEmitter.emit("taskAdded", task);
    });
    return tasksWithHash;
  } catch (err) {
    console.error("Error saving tasks:", err);
    throw err;
  }
};

export const completeTask = async (id) => {
  const pathToFile = path.join(import.meta.dirname, "../data/tasks.json");
  try {
    const data = await fs.readFile(pathToFile, "utf-8");
    const tasks = JSON.parse(data);
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task,
    );
    await fs.writeFile(pathToFile, JSON.stringify(updatedTasks, null, 2));
    eventEmitter.emit("taskCompleted", id);
  } catch (err) {
    console.error("Error completing task:", err);
    throw err;
  }
};

export const deleteTask = async (id) => {
  const pathToFile = path.join(import.meta.dirname, "../data/tasks.json");
  try {
    const data = await fs.readFile(pathToFile, "utf-8");
    const tasks = JSON.parse(data);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await fs.writeFile(pathToFile, JSON.stringify(updatedTasks, null, 2));
    eventEmitter.emit("taskDeleted", id);
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
};

export const initStorage = async () => {
  const dirPath = path.join(import.meta.dirname, "../data");
  const filePath = path.join(dirPath, "tasks.json");

  try {
    await fs.mkdir(dirPath, { recursive: true });

    try {
      await fs.access(filePath);
      eventEmitter.emit("appStarted");
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(filePath, JSON.stringify([]));
        eventEmitter.emit("appStarted");
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
    throw err;
  }
};
