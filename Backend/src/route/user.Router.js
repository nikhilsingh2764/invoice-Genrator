import express from 'express';
import validate from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.middleware.js';

import { googleLoginController } from '../controller/googleAuth.controller.js';

import {
    Signup, DeactivateAccount, ForgotPassword, ResetPassword, VerifyOTP,
    DeleteAccount, Login, Profile, Logout, UpdateProfile, UpdatePassword
} from '../controller/user.controller.js';

import {
    signupValidator, verifyOtpValidator, LoginValidator, updateProfileValidator,
    changePasswordValidator, forgotPasswordValidator, resetPasswordValidator
} from '../validators/auth.validator.js';

import {
    apiLimiter, forgotPasswordLimiter, verifyOtpLimiter,
    signupLimiter, loginLimiter
} from '../middleware/rateLimiter.middleware.js';


const router = express.Router();


router.post(
    '/Signup',
    signupLimiter,
    signupValidator,
    validate,
    Signup
)

router.post(
    '/verify-otp',
    verifyOtpLimiter,
    verifyOtpValidator,
    validate,
    VerifyOTP
)

router.post(
    '/Login',
    loginLimiter,
    LoginValidator,
    validate,
    Login
)

router.get(
    '/Profile',
    apiLimiter,
    authMiddleware,
    Profile
)

router.post(
    '/Logout',
    authMiddleware,
    Logout
)

router.patch(
    '/Update-Profile',
    apiLimiter,
    authMiddleware,
    updateProfileValidator,
    validate,
    UpdateProfile
);

router.patch(
    '/change-password',
    apiLimiter,
    authMiddleware,
    changePasswordValidator,
    validate,
    UpdatePassword
);


router.patch(
    '/deactivate-account',
    apiLimiter,
    authMiddleware,
    DeactivateAccount
)

router.delete(
    '/delete-account',
    apiLimiter,
    authMiddleware,
    DeleteAccount
)

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    forgotPasswordValidator,
    validate,
    ForgotPassword
);

router.post(
    "/reset-password",
    verifyOtpLimiter,
    resetPasswordValidator,
    validate,
    ResetPassword
);


router.post(
    "/google",
    googleLoginController
);


export default router;
































