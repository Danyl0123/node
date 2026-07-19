import http from "node:http";
import {
  initStorage,
  readTasks,
  saveTasks,
  completeTask,
  deleteTask,
} from "./modules/fileStorage.js";
import { addTask } from "./modules/taskService.js";

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  const matchTasksRoute = parsedUrl.pathname.match(/^\/tasks\/(\d+)$/);

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Study Task Tracker API</h1>");
    res.end();
  } else if (
    req.method === "GET" &&
    parsedUrl.pathname === "/tasks" &&
    !parsedUrl.searchParams.has("status")
  ) {
    const tasks = await readTasks();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks));
  } else if (req.method === "POST" && parsedUrl.pathname === "/tasks") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        let tasks = JSON.parse(body);

        //запись в файл была реализовано для массива - оставил возможность передавать массивом таски,или если просто обьект то записывается в массив для дальнейших функций
        if (!Array.isArray(tasks)) {
          tasks = [tasks];
        }

        if (tasks.some((task) => !task.title)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "task hasn`t title" }));
        } else {
          const newTasks = tasks.map((t) => addTask(t.title));
          const newTaskWithHash = await saveTasks(newTasks);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newTaskWithHash));
        }
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end();
      }
    });
  } else if (
    req.method === "GET" &&
    parsedUrl.pathname === "/tasks" &&
    parsedUrl.searchParams.has("status")
  ) {
    const statusParamsValue = parsedUrl.searchParams.get("status");
    const allTasks = await readTasks();
    res.writeHead(200, { "Content-Type": "application/json" });

    if (statusParamsValue === "active") {
      res.end(JSON.stringify(allTasks.filter((task) => !task.completed)));
    } else if (statusParamsValue === "completed") {
      res.end(JSON.stringify(allTasks.filter((task) => task.completed)));
    } else {
      res.end(JSON.stringify(allTasks));
    }
  } else if (req.method === "GET" && matchTasksRoute) {
    const taskId = +matchTasksRoute[1];
    const allTasks = await readTasks();
    const task = allTasks.find((task) => task.id === taskId);
    if (!task) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Task not found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(task));
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.write("<h1>Page not found</h1>");
    res.end();
  }
});

initStorage()
  .then(() => server.listen(3001, () => console.log("server starts")))
  .catch(() => console.error("error init storage"));
