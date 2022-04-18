const express = require("express");
const router = express.Router();
const privateRoute = require("../middlewares/verifyToken");
const User = require("../models/user.model");
const Video = require("../models/video.model");
const isVideoPresentFunc = async (userId, videoId) => {
  let user = await User.findById(userId);
  let history = user.history;
  const isvideoInHistoryArr = history.filter(
    (item) => {
  
      return JSON.stringify(item._id) === JSON.stringify(videoId)
    }
  );

  if (isvideoInHistoryArr.length !== 0) {
    return true;
  }
  return false;
};
router.get("/", privateRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    let user = await User.findById(userId).populate("history.videoId");
    let history = user.history;
  
    res.status(200).json({
      success: true,
      message: "History Videos fetched Successfully",
      history: history,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error.message,
      message: "Error occured while getting History",
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
router.delete("/:videoId", privateRoute, async (req, res) => {

  const videoId = req.video._id

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    let history = user.history
 
    const updatedHistory = history.filter(el=>{
      return JSON.stringify(el._id)!==JSON.stringify(videoId)
    })
  
    user.history = updatedHistory
    await user.save();
    res.status(200).json({
      success: true,
      message: "History Videos deleted Successfully",
      history: user.history,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error.message,
      message: "Error occured while deleting History",
      userId: req.user._id,
    });
  }
});

router.route("/:videoId").post(privateRoute, async (req, res) => {
  
  try {
    const videoId = req.video._id;
 
    const userId = req.user._id;
     const isVideoInHistory = await isVideoPresentFunc(userId,videoId)
    
      if(isVideoInHistory){
      res.send({success:false,message:"This video is already present in history"})
    }
    else{
    let user = await User.findById(userId);
    let history = user.history;
   
    history.push(videoId)
   
    user.history=history
    await user.save()
    let showUserHistory = await User.findById(userId).populate("history.videoId");
  
    history = showUserHistory.history;

    res.status(200).json({
      success: true,
      message: "Video successfully added to the history",
      updatedHistory:history,
    });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Video wasn't added to history",
      errorMessage: error.message,
    });
  }
});

module.exports = router;