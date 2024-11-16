import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectRoute =async (req,res,next) => {
  try {
    const token=req.cookies.jwt;
    if(!token){
      return res.status(401).json({error:"You need to be logged in"})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
      return res.status(401).json({error:"Invalid token"})
    }

    const user=await User.findById(decoded.userId).select("-password");

    if(!user){
      return res.status(404).json({error:"User not found"})
    }

    req.user=user;

    next();
  } catch (error) {
    res.status(400).json({error:"Invalid token"})
  }
}

export default protectRoute