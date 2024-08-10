import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token ){
        console.log("no token found in cookies or headers");
    }
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken){
        console.log("Could not verify token")
    }
    const user= await User.findById(decodedToken?._id)
    req.user=user;
    next();
    
  } catch (error) {
    console.log("internal server error: " + error)
    
  }
}
export { verifyJWT };
