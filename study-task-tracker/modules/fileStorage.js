import path from "path";
import fs from "fs/promises";

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
    await fs.writeFile(pathToFile, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error("Error saving tasks:", err);
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
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(filePath, JSON.stringify([]));
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
    throw err;
  }
};
