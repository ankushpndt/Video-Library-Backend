const jwt = require('jsonwebtoken')
function verifyToken(req,res,next){
  const token = req.header("auth-token")

  if(!token) res.status(401).json({message:"Access denied"})
  
  try{
    const verified = jwt.verify(token,'ankush')
    req.user = verified
    next()
  }catch (error) {
    res.status(400).json({message:"Invalid Token"});
  }
}
module.exports = verifyToken