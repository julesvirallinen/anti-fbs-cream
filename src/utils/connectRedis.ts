import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connect successfully");
    redisClient.set("try", "Welcome to Express and TypeScript with Prisma");
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
