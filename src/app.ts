require("dotenv").config();
import express, { Request, Response } from "express";
import config from "config";
import validateEnv from "./utils/validateEnv";
import { PrismaClient } from "@prisma/client";
import redisClient from "./utils/connectRedis";
import bodyParser from "body-parser";

validateEnv();

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

async function bootstrap() {
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

  app.post(
    "/api/createUser",
    async (
      req: TypedRequestBody<{ email: string; name: string; password: string }>,
      res: Response
    ) => {
      const userData = req.body;
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          // LOL :D
          // TODO: add sso before anything real happens
          password: userData.password,
          verified: true,
        },
      });
      res.status(200).json(user);
    }
  );
  app.post(
    "/api/createApiKey",
    async (req: TypedRequestBody<{ userId: string }>, res: Response) => {
      const data = req.body;
      const user = await prisma.apiKey.create({
        data: { userId: data.userId },
      });
      res.status(200).json(user);
    }
  );

  app.get("/api/users", async (_, res: Response) => {
    const users = await prisma.user.findMany({
      select: { name: true, createdAt: true, id: true },
    });

    return res.status(200).json(users);
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
