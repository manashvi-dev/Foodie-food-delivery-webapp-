const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },

    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],

    totalAmt: {
        type: Number,
        required: true
    },

    deliveryAdd: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "placed",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ],
        default: "placed"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);