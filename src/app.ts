require("dotenv").config();
import express, { Request, Response } from "express";
import config from "config";
import validateEnv from "./utils/validateEnv";
import redisClient from "./utils/connectRedis";
import bodyParser from "body-parser";
import { TAuthenticated, TypedRequestBody } from "./routes/models";
import { userRoutes } from "./routes/users";
import { prismaClient } from "./db/prisma";
import { authenticateKey } from "./api/authenticate";
import { eventRoutes } from "./routes/events";

validateEnv();

const prisma = prismaClient;
const app = express();
app.use(bodyParser.json());

async function bootstrap() {
  app.use("/api/users", userRoutes);
  app.use("/api/events", authenticateKey, eventRoutes);

  // Testing
  app.get("/api/healthchecker", async (_, res: Response) => {
    const message = await redisClient.get("try");
    res.status(200).json({
      status: "success",
      message,
    });
  });

  app.get("/", async (_, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "no moro",
    });
  });

  const port = config.get<number>("port");
  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
