const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const videosRouter = require("./routes/video.route");
const userRouter = require("./routes/user.route");
const likedVideosRouter = require("./routes/likedVideos.route");
const watchLaterRouter = require("./routes/watchLater.route");
const historyRouter = require("./routes/history.route");
const playlistRouter = require("./routes/playlist.route");
const initializeDbConnection = require("./db/db.connection");

const PORT = process.env.PORT || 5000;

const app = express();

initializeDbConnection();

app.use(cors());
app.use(bodyParser.json());

app.use("/video", videosRouter);
app.use("/user", userRouter);
app.use("/likedvideo", likedVideosRouter);
app.use("/watchlater", watchLaterRouter);
app.use("/history", historyRouter);
app.use("/playlist", playlistRouter);
app.get("/", (req, res) => {
  res.send("Video lib" );
});
app.use("*", function (req, res) {
  res.status(400).json("Page Not Found");
});




app.listen(PORT, () => {
  console.log("server started at",PORT);
});