require("dotenv").config();
const express = require("express");
const connectDB = require("./configs/db.config");
const indexRoutes = require("./routes");

const app = express();

connectDB();

app.use(express.json());

app.use("/api", indexRoutes);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
