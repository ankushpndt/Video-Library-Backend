const express = require("express");
const router = express.Router();
const privateRoute = require("../middlewares/verifyToken");
const User = require("../models/user.model");
const Video = require("../models/video.model");

const isVideoPresentFunc = async (userId, videoId) => {
  let user = await User.findById(userId);
  let watchLater = user.watchLater;
  const isvideoInWatchLaterArr = watchLater.filter(
    (item) => JSON.stringify(item._id) === JSON.stringify(videoId)
  );

  if (isvideoInWatchLaterArr.length !== 0) {
    return true;
  }
  return false;
};

router.get("/", privateRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    let user = await User.findById(userId).populate("watchLater.videoId");

    let watchLater = user.watchLater;

    res.json({
      success: true,
      message: "Watch Later Videos fetched Successfully",
      watchLater: watchLater,
    });
  } catch (error) {
    res.json({
      success: true,
      errorMessage: error.message,
      message: "Error occured while getting Watch later",
      userId: req.user._id,
    });
  }
});

router.param("videoId", async (req, res, next, id) => {
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Video not found",
      });
    }
    req.video = video;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.route("/:videoId").post(privateRoute, async (req, res) => {
  try {
    const videoId = req.video._id;
    const userId = req.user._id;
     const isVideoInWatchLater = await isVideoPresentFunc(userId,videoId)
    
      if(isVideoInWatchLater){
      res.send({success:false,message:"This video is already present in watch later "})
    }
    else{
    let user = await User.findById(userId);
    let watchLater = user.watchLater;
      watchLater.push(videoId);
      user.watchLater = watchLater;
      await user.save();

      res.json({
        success: true,
        message: "Video successfully added to the watchLater",
        updatedWatchLater: user.watchLater,
      });
    }
  }
   catch (error) {
    res.json({
      success: false,
      message: "Video wasn't added to watchLater",
      errorMessage: error.message,
    });
  }
});
router.delete("/:videoId", privateRoute, async (req, res) => {

  const videoId = req.video._id

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    let watchLater = user.watchLater
 
    const updatedWatchLater = watchLater.filter(el=>{
      return JSON.stringify(el._id)!==JSON.stringify(videoId)
    })
  
    user.watchLater = updatedWatchLater
    await user.save();
    res.status(200).json({
      success: true,
      message: "WatchLater Videos deleted Successfully",
      watchLater: user.watchLater,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      errorMessage: error.message,
      message: "Error occured while deleting Watch Later",
      userId: req.user._id,
    });
  }
});
module.exports = router;