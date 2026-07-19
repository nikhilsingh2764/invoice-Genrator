
//Rate limiting controls how many requests a user can send within a specific time.

//we use redis-rate limit instead of normal reson:
{/*

in normal rate limit : 



export const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 5,

    message: {
        success: false,
        message: "Too many attempts, try again after 15 minutes"
    },

    standardHeaders: true,
    legacyHeaders: false

});

it store count in your Node.js process memory.
like:- Node Server Memory

{
   "192.168.1.10": 3,
   "192.168.1.20": 5,
   "192.168.1.30": 1
}

problem is when server restart memory become empty {}. so attacker quickly get 5 new request immediately
another problem is in big applciation multipe server are there like A,B,C.. :request 1 to server A
                                    

redis -rate limit solve all this:-

in normal, count is store in multiple server
but in redis all server count is store in redis cache so every server get same count


*/}


//code of redis rate limit ok

import rateLimit from "express-rate-limit"; //middleware limit API request
import { RedisStore } from "rate-limit-redis"; //store rate limit data inside redis instead of node memory

import redis from "../config/redis.js"; //redis client connection



// reusable Redis Store
const createStore = (prefix) =>
    new RedisStore({
        sendCommand: (...args) => redis.call(...args), // express-rate-limit uses this function to communicate with Redis
        prefix, //keeps different limiters like login signup separeated in redis
    });



// ==============================
// Login Limiter
// 5 requests / 1 minute
// ==============================


export const loginLimiter = rateLimit({

    store: createStore("login:"), //store count in redis store/cache

    windowMs: 1 * 60 * 1000,  //1 min - Time window for counting requests

    max: 15,  //maximum 5 request send


    standardHeaders: true, // Sends modern RateLimit headers - RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset

    legacyHeaders: false, //Disable old X-RateLimit-* headers


    message: {   //Response returned when limit is exceeded

        success: false,

        message:
            "Too many login attempts. Try again after 1 minute.",

    },


});








// ==============================
// Signup Limiter
// 3 requests / 1 hour
// ==============================



export const signupLimiter = rateLimit({

    store: createStore("signup:"), //store req count in redis store
    windowMs: 60 * 60 * 1000, //1 hr 
    max: 30,

    standardHeaders: true,

    legacyHeaders: false,


    message: {

        success: false,

        message:
            "Too many signup attempts. Try again later.",

    },



});





// ==============================
// Verify OTP Limiter
// 10 requests / 15 minutes
// ==============================

export const verifyOtpLimiter = rateLimit({

    store: createStore("verifyOtp:"),

    windowMs: 15 * 60 * 1000, //15 min

    max: 10,  //10 request 

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many OTP verification attempts.",

    },

});




// ==============================
// Forgot Password Limiter
// 3 requests / 15 minutes
// ==============================

export const forgotPasswordLimiter = rateLimit({

    store:  createStore("forgotPassword:"),
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,

        message:
            "Too many password reset requests.",
    }




});


// ==============================
// Refresh Token Limiter
// 30 requests / 1 minute
// ==============================

export const refreshTokenLimiter = rateLimit({
    store: createStore("refreshToken:"),
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many refresh requests."
    }


});


// ==============================
// General API Limiter
// For authenticated routes
// 200 requests / 15 minutes
// ==============================



export const apiLimiter = rateLimit({

    store: createStore("api:"),

    windowMs: 15 * 60 * 1000,

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many requests. Please try again later.",

    },

});



















