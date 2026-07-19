import { body } from "express-validator";

export const createBusinessValidator = [


        body("businessName")
                .trim()
                .notEmpty()
                .withMessage("Business name is required")
                .isLength({ min: 3, max: 100 })
                .withMessage("Business name must be between 3 and 100 characters"),




        body("ownerName")
                .trim()
                .notEmpty()
                .withMessage("owner name is required")
                .isLength({ min: 3, max: 100 })
                .withMessage("owner name must be between 3 and 100 characters"),


        body("email")
                .trim()
                .notEmpty()
                .withMessage("Email is required")
                .normalizeEmail()
                .isEmail()
                .withMessage("Please provide a valid email address."),




        body("phone")
                .trim()
                .notEmpty()
                .withMessage("Phone number is required")
                .matches(/^[0-9]{10}$/)
                .withMessage("Phone number must contain exactly 10 digits"),




        body("gstNumber")
                .optional({ checkFalsy: true })
                .trim()
                .matches(/^[0-9A-Za-z]{15}$/)
                .withMessage("GST number must be exactly 15 characters"),


        body("addressLine1")
                .trim()
                .notEmpty()
                .withMessage("Address is required"),


        body("city")
                .trim()
                .notEmpty()
                .withMessage("city is required"),




        body("state")
                .trim()
                .notEmpty()
                .withMessage("state is required")
                .isIn([
                        "Andhra Pradesh",
                        "Arunachal Pradesh",
                        "Assam",
                        "Bihar",
                        "Chhattisgarh",
                        "Goa",
                        "Gujarat",
                        "Haryana",
                        "Himachal Pradesh",
                        "Jharkhand",
                        "Karnataka",
                        "Kerala",
                        "Madhya Pradesh",
                        "Maharashtra",
                        "Manipur",
                        "Meghalaya",
                        "Mizoram",
                        "Nagaland",
                        "Odisha",
                        "Punjab",
                        "Rajasthan",
                        "Sikkim",
                        "Tamil Nadu",
                        "Telangana",
                        "Tripura",
                        "Uttar Pradesh",
                        "Uttarakhand",
                        "West Bengal"
                ])
                .withMessage("Invlaid state"),



        body("country")
                .trim()
                .notEmpty()
                .withMessage("Country is required"),


        body("postalCode")
                .trim()
                .notEmpty()
                .withMessage("Postal code is required")
                .matches(/^[1-9][0-9]{5}/)
                .withMessage("Invalid postal code"),



        body("currency")
                .isIn([
                        "USD", "EUR", "GBP", "JPY", "INR",
                        "CHF", "CAD", "AUD", "CNY", "RUB",
                        "BRL", "ZAR", "MXN", "SGD", "SEK",
                        "KRW", "HKD", "NZD", "TRY", "IDR", "ILS"
                ])
                .withMessage("Invalid currency"),



        body("signature")
                .optional({ checkFalsy: true })
                .trim(),

        body("logo")
                .optional({ checkFalsy: true })
                .trim(),



        body("invoicePrefix")
                .optional()
                .trim()
                .isLength({ min: 2, max: 10 })
                .withMessage("Invoice prefix must be between 2 and 10 characters"),


        body("invoiceStartNumber")
                .optional()
                .isInt({ min: 1 })
                .withMessage("Invoice start number must be at least 1"),


        body("termsAndConditions")
                .optional()
                .trim()
                .isLength({ max: 1000 })
                .withMessage("Terms and conditions cannot exceed 1000 characters"),



]