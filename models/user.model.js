const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name:{
      type:String,
    required:true
  },
  email:{
      type:String,
    required:true
  },
  password:{
      type:String,
    required:true
  },
  likedVideos:[
    {
      videoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    }
  ],
  history:[
    {
     videoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
      
    }
  ],
  watchLater:[
    {
       videoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
      
    }
  ],
   
},{timestamps:true})

const User = mongoose.model("user",UserSchema)
module.exports = User