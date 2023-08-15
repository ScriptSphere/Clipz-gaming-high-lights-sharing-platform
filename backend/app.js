// *****Modules*****
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// *****coustome modules*****
const userManipModule = require("./custom_modules/user");
const videoModule = require("./custom_modules/video");

// *****File Uploads*****
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".mp4");
  },
});
const videoUpload = multer({ storage: videoStorage });

// *****Global variables*****
const app = express();

const port = 550;

// *****Database Connection*****
mongoose
  .connect(
    `mongodb://${process.env.db_user}:${process.env.db_pwd}@${process.env.db_host}:${process.env.db_port}/${process.env.db}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected the database!");
  })
  .catch((error) => {
    console.log(error);
  });

// *****configuration*****
app.use(
  cors({
    origin: process.env.frontend_url,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser(process.env.secrate_key));
app.use(express.static(path.join(__dirname, "/public")));

// *****Routing*****
// registeration api:
app.post("/register", async (req, res) => {
  const success = await userManipModule.add(req.body);

  if (success) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});
// login and log out
app.post("/login", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.frontend_url);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const userId = await userManipModule.login(req.body.email, req.body.password);

  if (userId) {
    const token = jwt.sign({ userId: userId }, process.env.secrate_key);

    res.cookie("clipzuser", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // tis cookie will expire after one day
      signed: true,
    });
    res.send({ login: true });
  } else {
    res.send({ login: false });
  }
});
app.get("/logout", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.frontend_url);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.clearCookie("clipzuser");
  res.send({ login: false });
});
// is email taken
app.post("/email-taken", async (req, res) => {
  const emailTaken = await userManipModule.emailTaken(req.body.email);

  res.send({ taken: emailTaken });
});
// upload video
app.post("/videos/upload", videoUpload.single("video"), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.frontend_url);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const clipId = await videoModule.add({
    title: req.body.title,
    filePath: `/videos/${req.file.filename}`,
    owner: jwt.verify(req.signedCookies.clipzuser, process.env.secrate_key)
      .userId,
  });

  if (clipId) res.send({ clipId: clipId });
  else res.sendStatus(500);
});
// view a video:
app.get("/videos/:id", async (req, res) => {
  const video = await videoModule.get(req.params.id);
  video.password = null;

  if (video) {
    res.send(video).status(200);
  } else {
    res.status(500);
  }
});
// videos uploaded by a particular user:
app.get("/videos/uploads/:sort", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.frontend_url);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const id = jwt.verify(
    req.signedCookies.clipzuser,
    process.env.secrate_key
  ).userId; // id of the user of whome we want uploaded videos
  const uploadedVideos = await videoModule.getManyByUserId(
    id,
    Number(req.params.sort)
  );

  res.send(uploadedVideos);
});
// delete a clip:
app.delete("/videos/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  videoModule
    .deleteVideo(videoId)
    .then(() => {
      res.send({ success: true });
    })
    .catch(() => {
      res.send({ success: false });
    });
});

// *****Starting Server*****
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server listening on http://localhost:${port}`);
  }
});
