const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require("bcryptjs");
const User = require('../models/user.model')
router.post("/signup",async(req,res)=>{
  const {name,email,password}=req.body
  
  try{
   
    if (!name) res.status(404).json({ message: "Please enter your Name." })
    if (!email) res.status(404).json({ message: "Please enter your Email Id." })
    if (!password) res.status(404).json({ message: "Please enter your Password." })
const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password,salt)
       if (email) {
      //finding user
      const user = await User.findOne({ email })
      if (user) {
        //checking if user exists
        if (email === user.email) res.json({ message: "This email id already exists." })
      }
      else  {
       
         //creating new user
    const newUser = new User({name,email,password:hashPassword,likedVideos:[],playlist:[],watchLater:[],history:[]})
    const saveUser = await newUser.save()
    const token = jwt.sign({ _id: saveUser._id }, 'ankush')
        res.header("auth-token").json({
          success: true,
          userid: saveUser._id,
          token: token,
          userName: saveUser.name,
        })
    
      }
    }

    else {
      //user not found
      res.status(404).json({ message: `No user found which has email id ${email}` })
    }  
  }
  catch(error){
    res.json({
        successs: false,
        message: "Not able to add User",
        errorMessage: error.message,
      });
  }
})

router.post("/login",async(req,res)=>{
try{
   //checking if user's email is already present
   const {email,password} = req.body
   const user = await User.findOne({email})
   if(!user) res.status(404).json({message:"This email id does not exist."})
   else{
     const validPass = await bcrypt.compare(password,user.password)
     console.log(validPass)
     if (!validPass) {
        res.status(400).json({ success: false, message: "Incorrect Password" });
      }
      else{
        //create token and assign
        const token = jwt.sign({_id:user._id},'ankush')
         res.header("auth-token").json({
            success: true,
          userid: user._id,
          token: token,
          userName: user.name,
         })
      }
   }
}
catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
})
module.exports = router