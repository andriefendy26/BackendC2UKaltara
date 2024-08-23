// import express from "express";
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./config/database");
const fileUpload = require("express-fileupload");

require("dotenv").config();

//route
const UserRoute = require("./routes/UserRoute");
const RoleRoute = require("./routes/RoleRoute");
const DataRoute = require("./routes/DataSampahRoute");
const LogbookRoute = require("./routes/LogbookRoute");
const AuthRoute = require("./routes/AuthRoute");
const BeritaRoute = require("./routes/BeritaRoute");
const KelurahanRoute = require("./routes/KelurahanRoute");

const app = express();

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const store = new SequelizeStore({
  db: db,
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: "auto" },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(fileUpload());
app.use(express.static("public"));

app.use(express.json());
app.use(UserRoute);
app.use(RoleRoute);
app.use(DataRoute);
app.use(LogbookRoute);
app.use(AuthRoute);
app.use(BeritaRoute);
app.use(KelurahanRoute);

// store.sync();

// Start the server
(async () => {
  try {
    //memeriksa koneksi ke DBMS

    // db.authenticate()
    //   .then(() => {
    //     console.log("Connection has been established successfully.");
    //   })
    //   .catch((err) => {
    //     console.error("Unable to connect to the database:", err);
    //   });

    //menyingkronkan database

    // await db.sync();
    // console.log("Database synchronized successfully.");
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server running on port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
})();
