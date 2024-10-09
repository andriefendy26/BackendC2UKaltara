// import express from "express";
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./config/database");
const fileUpload = require("express-fileupload");

//intergrasi google
const { google } = require("googleapis");
const drive = google.drive("v2");
const fs = require("fs");
const gd_folder_id = "1ZxtedFg8CnJkXG8mECRPVbzm_gT0DKLl";

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
    origin: "http://localhost:5173",
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

let token =
  "EAAH3uufuMrwBO6NVZBuu5GWio1sScqn08ZBx7UakuiA3C5alSXo3yqokO5s1AZBZCfZAV2BzoQvj5qtqBvYhgQOGE6rQ7eLgCzwSkIvonKzExUSOLdQWQwBb8CxZCcopDGhbAltQrLZBWWggJ1Ysdc4Xgac0PtKZBP6aYuXeZB6QeHJZB6Nt7KfZCcrihsw";
app.get("/api/media", async (req, res) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/17841468430804430/tags?fields=owner,media_url,permalink,media_type,username,comments,like_count,id&access_token=${token}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.get("/api/profile", async (req, res) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/17841468430804430?fields=biography,followers_count,follows_count,media_count,name,profile_picture_url,username&access_token=${token}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// const upFile = async () => {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: "./googledrive/c2u_apikey.json",
//       scopes: ["https://www.googleapis.com/auth/drive"],
//     });

//     const driveServices = google.drive({
//       version: "v3",
//       auth,
//     });

//     const fileMetaData = {
//       name: "gambassdasr",
//       parents: [gd_folder_id],
//     };

//     const Media = {
//       MimeType: "images/jpg",
//       body: fs.createReadStream("./test.jpg"),
//     };

//     const response = await driveServices.files.create({
//       resource: fileMetaData,
//       media: Media,
//       field: "id",
//     });

//     return response.data.id;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// upFile().then((data) => {
//   console.log(data);
// });

//https://drive.google.com/uc?export=view&id=1mI3OFx2nwhuolO56RpXaR-h6xeZ6Dqzi
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
