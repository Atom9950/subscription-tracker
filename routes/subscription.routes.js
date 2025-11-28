import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { 
  CreateSubscription, 
  GetSubscription, 
  GetAllSubscriptions,
  GetSubscriptionById,
  ExtendSubscription,
  CancelSubscription,
  DeleteSubscription,
  GetUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Get all subscriptions (admin/general route)
subscriptionRouter.get("/", authorize, GetAllSubscriptions);

// Get upcoming renewals (should be before /:id to avoid route conflict)
subscriptionRouter.get("/upcoming-renewals", authorize, GetUpcomingRenewals);

// Get subscription by id
subscriptionRouter.get("/:id", authorize, GetSubscriptionById);

// Get subscriptions for a specific user
subscriptionRouter.get("/user/:id", authorize, GetSubscription);

// Create new subscription
subscriptionRouter.post("/", authorize, CreateSubscription);

// Extend subscription
subscriptionRouter.put("/:id/extend", authorize, ExtendSubscription);

// Cancel subscription
subscriptionRouter.put("/:id/cancel", authorize, CancelSubscription);

// Delete subscription
subscriptionRouter.delete("/:id", authorize, DeleteSubscription);

export default subscriptionRouter;