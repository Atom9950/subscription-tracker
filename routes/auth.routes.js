import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const authRouter = Router();

//Path:api/v1/auth/signup (Method: POST)
authRouter.post("/signup", signup);

//Path:api/v1/auth/login (Method: POST)
authRouter.post("/login", login);

//Path:api/v1/auth/logout (Method: POST)
authRouter.post("/logout", logout);

export default authRouter;
