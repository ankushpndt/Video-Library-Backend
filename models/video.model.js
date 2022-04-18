const mongoose = require('mongoose');
const VideoSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  image:{
     type:String,
    required:true
  },
  date:{
     type:String,
    required:true
  },
  views:{
     type:String,
    required:true
  },
  videoId:{
    type:String,
    required:true
  },
 likedByUser:Array
},{timestamps:true})

const Video = mongoose.model('Video',VideoSchema)
module.exports = Video