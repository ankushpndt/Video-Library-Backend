const express = require("express");
const router = express.Router();
const privateRoute = require("../middlewares/verifyToken");

const Playlist = require("../models/playlist.model")


// create new playlist
router.route('/')
  .post(privateRoute,async (req, res) => {
    
    try {
      const newPlaylist = new Playlist(req.body)
      await newPlaylist.save();
      res.status(200).json({
        success: true,
        playlist: newPlaylist,
        message: 'New playlist created successfully'
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to create new playlist.'
      })
    }
  })
.get(privateRoute,async(req,res)=>{
  try{
    const allPlaylists = await Playlist.find({})
    res.status(200).json({success:true,message:"Fetched successfully", allPlaylists})
  }
  catch(err){
     res.status(400).json({
        success: false,
        message: 'Unable to create new playlist.'
      })
  }
})
// get all playlist for userId
router.route('/:userId')
  .get(privateRoute,async (req, res) => {
  
    try {
      const { userId } = req.params;
      const playlists = await Playlist.find({
        owner: userId
      });
     
      res.status(200).json({ success: true,message:"Playlist fetched successfully for a particular user", playlists });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Unable to fetch playlists' })
    }
  });

// add or remove video in 
router.route('/toggle/:playlistId')
  .post(privateRoute,async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;
    try {
      const playlist = await Playlist.findById({
        _id: playlistId,
      });
      const isVideoInPlaylist = playlist.videos.includes(videoId);

      isVideoInPlaylist ?
        playlist.videos.pull(videoId) :
        playlist.videos.push(videoId);

      await playlist.save();
      res.status(200).json({
        success: true,
        updatedPlaylist: playlist,
        message: 'Playlist updated successfully'
      })

    } catch (error) {
      res.status(400).json({ success: false, message: 'Unable to update playlist', error: error.message })
    }
  })
 router.route("/delete/:playlistId").delete(privateRoute,async (req, res) => {
   const {playlistId} = req.params;
    try {

      const playlist = await Playlist.findByIdAndDelete({_id:playlistId})
      
      res.status(200).json({
        success: true,
        message: "Playlist removed",
        deletedPlaylist:playlist
      })
    } catch(error) {
      res.status(400).json({
        success: false,
        message: "Could not delete playlist",
        error: error.message
      })
    }
  })
   router.route("/fetchSingle/:playlistId").get(privateRoute,async (req, res) => {
     const { playlistId } = req.params;
 
    try {
      
      const playlist = await Playlist.find({
        _id: playlistId,
      });
      res.status(200).json({ success: true,message:"Single playlist fetched successfully", playlist });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Unable to fetch playlist',  error: error.message })
    }
  });

router.post('/update/:playlistId',privateRoute,async (req, res) => {
    try {
      const { playlistId } = req.params;
      const { newName } = req.body;
      const playlist = await Playlist.findByIdAndUpdate({
        _id: playlistId,
      },
      {
        name: newName,
      },{new:true});
      res.status(200).json({ success: true, updatedPlaylistName:playlist, message: 'Playlist name updated' });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Could not update playlist name' })
    }
  })
module.exports = router;