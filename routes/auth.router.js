import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", (req, res) => {
  // Handle login logic here
  res.send({ title: "Signup successful" });
});

authRouter.post("/login", (req, res) => {
  // Handle login logic here
  res.send({ title: "Login successful" });
});

authRouter.post("/logout", (req, res) => {
  // Handle login logic here
  res.send({ title: "Logout successful" });
});

export default authRouter;
