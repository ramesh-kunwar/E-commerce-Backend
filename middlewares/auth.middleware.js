import User from "../models/user.schema"
import jwt  from "jsonwebtoken"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import config from "../config"

//
export const isLoggedIn = asyncHandler(async (req, res, next)=>{
    let token;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token) {
        throw new CustomError("Not authorized to access this route", 401)
    }
    try {
       const decodedJwtPayload =  jwt.verify(token, config.JWT_SECRET)
       //_id, find user based on id, set this in req.user
       req.user = await User.findById(decodedJwtPayload._id, "name email role")
       next()
    } catch (error) {
        throw new CustomError("Not authorized to access this route", 401)
        
    }
})