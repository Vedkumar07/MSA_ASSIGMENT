import express from "express";
import rateLimit from "express-rate-limit";

const rater = express();
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100, 
    message: { error: "Too many requests, please try again later." },
    headers: true, 
});
console.log("rateLimiter is active now");
rater.use(limiter);

export default rater;
