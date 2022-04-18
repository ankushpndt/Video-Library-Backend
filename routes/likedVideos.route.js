const privateRoute = require("../middlewares/verifyToken");
const express = require("express");
const router = express.Router();
const User = require('../models/user.model')
const Video = require('../models/video.model')

const isVideoPresentFunc = async (userId, videoId) => {
  let user = await User.findById(userId)
  const isVideoInLikedVideos = user.likedVideos.filter((video) => JSON.stringify(video._id) === JSON.stringify(videoId))

  if (isVideoInLikedVideos.length !== 0) {
    return true;
  }
  else {
    return false;
  }
}

router.get("/", privateRoute, async (req, res) => {
  try {
    const userId = req.user._id
    const currentUser = await User.findById(userId)
    const response = await currentUser.populate('likedVideos').execPopulate()
    res.json({ success: true, message: "fetched successfully", likedVideos: response.likedVideos })
  }
  catch (error) {
    res.status(400).json({ success: false, message: "couldn't fetch the videos", errMessage: error.message })
  }

})

router.param("videoId", async (req, res, next, videoId) => {
  try {
    const video = await Video.findById(videoId)
    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Video not found",
      });
    }
    req.video = video
    next()
  }

  catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

})
// to show liked videos
router.post("/:videoId", privateRoute, async (req, res) => {

  try {
    const videoId = req.video._id
    const userId = req.user._id
    let user = await User.findById(userId)

    const isVideoInLikedVideos = await isVideoPresentFunc(userId, videoId)

    if (isVideoInLikedVideos) {
      let likedVideos = user.likedVideos
      likedVideos.pull(videoId)
      user.likedVideos = likedVideos

      await user.save()

      res.status(200).json({ success: true, message: "Video deleted from liked videos.", updatedLikedVideos: user.likedVideos })
    }
    else {
      let likedVideos = user.likedVideos
      likedVideos.push(videoId)

      user.likedVideos = likedVideos

      await user.save()

      res.status(200).json({ success: true, message: "Video added successfully to liked videos.", updatedLikedVideos: user.likedVideos })
    }
  }
  catch (error) {
    res.status(400).json({ success: false, message: "Couldn't add video to liked videos", errMessage: error.message })
  }
})

router.delete("/:videoId", privateRoute, async (req, res) => {

  const videoId = req.video._id

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    let likedVideos = user.likedVideos

    const updatedlikedVideos = likedVideos.filter(el => {
      return JSON.stringify(el._id) !== JSON.stringify(videoId)
    })

    user.likedVideos = updatedlikedVideos
    await user.save();
    res.status(200).json({
      success: true,
      message: "Videos deleted successfully from liked videos",
      likedVideos: user.likedVideos,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error.message,
      message: "Error occured while deleting",
      userId: req.user._id,
    });
  }
});
module.exports = router;