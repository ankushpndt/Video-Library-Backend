const router = require('express').Router()
const Video = require('../models/video.model')
const User = require("../models/user.model")
const privateRoute = require("../middlewares/verifyToken")
const { extend } = require('lodash')
const isVideoPresentFunc2 = async (userId, videoId) => {

  let video = await Video.findById(videoId)

  //likedByUser
  const isUserInLikedByUser
    = video.likedByUser.filter(user_Id => JSON.stringify(user_Id) === JSON.stringify(userId))

  if (isUserInLikedByUser.length !== 0) {
    return true
  }
  else {
    return false
  }
}
router.route("/")
  .get(async (req, res) => {
    try {
      const videoList = await Video.find({})

      res.status(200).json({ success: true, message: "Videos got fetched successfully", videoList })
    }
    catch (err) {
      console.log("Error Occurred :", err.message)
      res.status(404).json({ success: false, message: "Error Occurred Retrieving Videos", errMessage: err.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { title, image, date, views } = req.body
      const newVideo = await new Video({ title, image, date, views })
      const savedVideo = await newVideo.save()
      res.status(200).json({ status: true, message: "Video got added successfully", savedVideo })
    }
    catch (err) {
      console.log("Error Occurred :", err.message)
      res.status(404).json({ success: false, message: "Error Occurred While Adding Videos", errMessage: err.message })
    }
  })


router.param("id", async (req, res, next, id) => {
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Could Not Find Video" })
    }
    req.video = video;
    next()
  } catch (err) {
    console.log("Error Occurred :", err.message)
    res.status(400).json({ success: false, message: "Error Occurred While Retrieving Video", errMessage: err.message })
  }
})

router.route("/:id")
  .get((req, res) => {
    let { video } = req;
    video.__v = undefined;
    res.status(200).json({ success: true, video })
  })
  .post(async (req, res) => {
    let { video } = req;
    let videoUpdates = req.body
    video = extend(video, videoUpdates)
    try {
      video = await video.save()
      res.status(200).json({ success: true, video })
    } catch (err) {
      res.status(400).json({ success: false, message: "Error Occurred Updating Video", errMessage: err.message })
    }
  })

  .delete(async (req, res) => {
    let { video } = req
    try {
      await video.remove()
      res.status(200).json({ success: true, message: "Video Deleted Successfully" })
    } catch (err) {
      res.status(400).json({ success: false, message: "Error Occurred Deleting Video", errMessage: err.message })
    }
  })
//likedByUser for like and unlike
router.post("/likedbyuser/:id", privateRoute, async (req, res) => {

  try {

    const videoId = req.video._id
    const userId = req.user._id
    let video = await Video.findById(videoId)

    const isUserInLikedByUser = video.likedByUser.includes(userId)
    isUserInLikedByUser ? video.likedByUser.pull(userId) : video.likedByUser.push(userId)
    await video.save()
    res.status(200).json({ success: true, message: "User updated in liked by user.", updatedLikedByUser: video.likedByUser })

  }
  catch (error) {
    res.status(400).json({ success: false, message: "Couldn't add user to liked by user", errMessage: error.message })
  }
})
module.exports = router