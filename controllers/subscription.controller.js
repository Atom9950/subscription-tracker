import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const CreateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
}

export const GetSubscription = async (req, res, next) => {
    try {
        // Check if the user is same as the one in the token
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }
        const subscription = await Subscription.find({user: req.user._id});
        res.status(200).json({
            status: true,
            data: subscription
        })

    } catch (error) {
        next(error);
    }
}

export const GetAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find().populate('user', 'name email');
        res.status(200).json({
            status: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
}

export const GetSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            status: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

export const ExtendSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        // Check if the user owns this subscription
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to extend this subscription');
            error.status = 403;
            throw error;
        }

        // Extend the subscription (assuming req.body contains extensionMonths or newEndDate)
        const { extensionMonths, newEndDate } = req.body;
        
        // Determine which date field to use (endDate or renewalDate)
        const dateField = subscription.endDate ? 'endDate' : 'renewalDate';
        
        if (newEndDate) {
            subscription[dateField] = new Date(newEndDate);
        } else if (extensionMonths) {
            const currentDate = new Date(subscription[dateField] || new Date());
            currentDate.setMonth(currentDate.getMonth() + extensionMonths);
            subscription[dateField] = currentDate;
        }

        // Update status to active if it was expired/cancelled
        if (subscription.status === 'expired' || subscription.status === 'cancelled') {
            subscription.status = 'active';
        }

        await subscription.save();

        res.status(200).json({
            status: true,
            message: 'Subscription extended successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

export const CancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        // Check if the user owns this subscription
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to cancel this subscription');
            error.status = 403;
            throw error;
        }

        subscription.status = 'cancelled';
        subscription.cancelledAt = new Date();
        subscription.renewalDate = null; 
        subscription.endDate = null; // Reset endDate to null when cancelled
        await subscription.save();

        res.status(200).json({
            status: true,
            message: 'Subscription cancelled successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

export const DeleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        // Check if the user owns this subscription
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to delete this subscription');
            error.status = 403;
            throw error;
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const GetUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const daysAhead = parseInt(req.query.days) || 30; // Default to 30 days
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysAhead);

        const upcomingRenewals = await Subscription.find({
            endDate: {
                $gte: today,
                $lte: futureDate
            },
            status: { $ne: 'cancelled' }
        }).populate('user', 'name email');

        res.status(200).json({
            status: true,
            data: upcomingRenewals
        });
    } catch (error) {
        next(error);
    }
}