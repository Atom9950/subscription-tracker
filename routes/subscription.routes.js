import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { CreateSubscription, GetSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "GET all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "GET subscription by id" });
});

subscriptionRouter.post("/", authorize, CreateSubscription);

subscriptionRouter.put("/:id/extend", (req, res) => {
  res.send({ title: "UPDATE subscription by id" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE subscription by id" });
});

subscriptionRouter.get("/user/:id", authorize, GetSubscription)

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "CANCEL subscription by id" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "GET upcoming renewals" });
});

export default subscriptionRouter;
