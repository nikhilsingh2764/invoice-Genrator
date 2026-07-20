import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    addressLine1: {
        type: String,
        required: true,
        trim: true
    },

    addressLine2: {
        type: String,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    state: {
        type: String,
        required: true,
        trim: true,
        enum: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        default: "Assam"
    },

    country: {
        type: String,
        required: true,
        trim: true,
        enum: ["India"],
        default: "India"
    },

    postalCode: {
        type: String,
        required: true,
        trim: true,
        match: /^[1-9][0-9]{5}$/
    }

}, { _id: false });



const CustomerSchema = new mongoose.Schema({

    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },


    customerName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },


    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10}$/
    },


    companyName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 100

    },

    gstNumber: {
        type: String,
        trim: true,
        match: /^[0-9A-Za-z]{15}$/
    },

    customerType: {
        type: String,
        trim: true,
        required: true,
        enum: ["Individual ", "Business"],
        default: "Individual"
    },

    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },

    billingAddress: {

        type: addressSchema,
        required: true

    },


    shippingAddress: {

        type: addressSchema,

    }


}, { timestamps: true })

const Customer = mongoose.model("Customer", CustomerSchema)


export default Customer;
















