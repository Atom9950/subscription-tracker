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
subscriptionSchema.pre('save', function(){  // Removed 'next' parameter
    if(!this.renewalDate && this.startDate && this.frequency){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto update status if renewal date has passed
    if(this.renewalDate && this.renewalDate < new Date()){
        this.status = "expired";
    }
    // No need to call next() - just return or let function complete
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
