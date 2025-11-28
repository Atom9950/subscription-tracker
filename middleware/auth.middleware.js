import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        console.log('Token received:', token);

        if (!token) {
            return res.status(401).json({message: "Unauthorized", error: "No token provided"});
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);
        console.log('Looking for user with ID:', decoded.userId); 

        const user= await User.findById(decoded.userId);
        console.log('User found:', user);
        if(!user) {
            return res.status(401).json({message: "Unauthorized", error: "User not found"});
        }
        req.user = user;

        next();
    } catch (error) {
        console.error('Error in authorize middleware:', error);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export default authorize;
