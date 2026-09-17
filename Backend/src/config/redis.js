import Redis from "ioredis";

console.log(process.env.REDIS_URL);

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

export default redis;