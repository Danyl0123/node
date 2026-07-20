import express from "express";
// import path from "path";
// import expressHandlebars from "express-handlebars";
import hbs from "hbs";
import students from "./mock/students.js";

const app = express();

app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString("uk-UA");
  console.log(`${req.method} ${req.url} - ${currentTime}`);
  next();
});

app.use(express.json());

// app.use(express.static(path.join(import.meta.dirname, "public")));

app.set("view engine", "hbs");
hbs.registerHelper("isEqual", function (val1, val2, options) {
  return val1 === val2 ? options.fn(this) : options.inverse(this);
});

app.use("/profile", (_, res) => {
  res.render("profile", {
    name: "Данило",
    isOnline: "not truthy condition",
    role: "Студент курсу Node.js",
    hobbies: ["хобі 1", "хобі 2", "хобі 3"],
  });
});

app.use("/students", (_, res) => {
  res.render("students", {
    data: students,
  });
});

app.get("/", (req, res) => {
  res.send("Головна сторінка!");
});

app.get("/about", (req, res) => {
  res.send("Про нас!");
});

app.get("/time", (req, res) => {
  const time = new Date().toLocaleString("uk-UA");
  res.send(`Поточний час ${time}`);
});

app.get("/error", (req, res) => {
  res.status(500).send("Помилка сервера");
});

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`Користувач з ID: ${userId}`);
});

app.get("/search", (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.status(400).send("Не вказано пошуковий запит.");
    return;
  }
  res.send(`Ви шукали: ${searchQuery}`);
});

app.get("/users/:id/search", (req, res) => {
  const userId = req.params.id;
  const userPosition = req.query.position;
  if (isNaN(userId) || !userPosition) {
    res.status(404).send("Невалідний id або невказана позиція корситувача!");
    return;
  }

  res.send(`Позиція користувача з id: ${userId} - ${userPosition}`);
});

app.post("/feedback", (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send("Поле name є обов'язковим");
    return;
  }
  res.send(`Дякуємо, ${name}! Ваш відгук отримано.`);
});

app.get("/crash", (req, res) => {
  throw new Error("Тестова помилка");
});

app.use((req, res, next) => {
  res.render("not-found", { url: req.url });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Щось пішло не так!.");
});

app.listen(3000, () => {
  console.log("Сервер запущено!");
});
