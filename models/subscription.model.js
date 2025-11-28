import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength:2,
        maxlength:100,
    },
    price:{
        type: Number,
        required: [true, "Price is required"],
        min:[0, "Price should be greater than 0"],
    },

    currency:{
        type: String,
        enum:["USD", "EUR", "GBP", "INR", "JPY"],
        default: "USD",
    },

    frequency:{
        type: String,
        enum:["daily", "weekly", "monthly", "yearly"],
    },

    category:{
        type: String,
        enum:["entertainment", "education", "productivity", "health", "other"],
        required:[true, "Category is required"],
    },

    payment:{
        type: String,
        trim: true,
    },

    status:{
        type: String,
        enum:["active", "cancelled","expired"],
        default: "active",
    },

    startDate:{
        type: Date,
        validate:{
            validator: function(value){
                return value <= new Date();
            },
            message: "Start date should be a past date"
        }
    },

    renewalDate:{
        type: Date,
        validate:{
            validator: function(value){
                 if (value === null) return true;
                return value > this.startDate;
            },
            message: "Renewal date should be after start date"
        }
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        index:true,
    }

}, {timestamps: true});

// Auto calculate renewalDate based on frequency and startDate
subscriptionSchema.pre("save", function () {
    const renewalPeriods = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
    };

    // ⛔ Skip auto-renewal calculation when cancelled
    if (this.status === "cancelled") {
        return;
    }

    // Auto calculate renewal date
    if (!this.renewalDate && this.startDate && this.frequency) {
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(
            this.startDate.getDate() + renewalPeriods[this.frequency]
        );
    }

    // Auto expire if date passed
    if (
        this.status !== "cancelled" &&
        this.renewalDate &&
        this.renewalDate < new Date()
    ) {
        this.status = "expired";
    }
});


const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
