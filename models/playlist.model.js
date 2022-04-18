const mongoose = require("mongoose");
const PlaylistSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: "Cannot add unnamed Playlist.",
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
}, { timestamps: true });
const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist 