// import express from "express";
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./config/database");
require("dotenv").config();

const UserRoute = require("./routes/UserRoute");
const RoleRoute = require("./routes/RoleRoute");
const DataRoute = require("./routes/DataSampahRoute");

const app = express();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
// app.use(UserRoute);
// app.use(RoleRoute);
// app.use(DataRoute);
// app.listen(process.env.APP_PORT, () => {
//   console.log(`Server running....`);
// });

// Start the server
(async () => {
  try {
    db.authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });

    await db.sync({ force: true });
    console.log("Database synchronized successfully.");

    app.listen(process.env.APP_PORT, () => {
      console.log(`Server running on port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
})();
