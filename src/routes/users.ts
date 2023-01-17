import express, { Response } from "express";
import { TypedRequestBody } from "./models";
import { prismaClient } from "../db/prisma";

const router = express.Router();

router.post(
  "/create",
  async (
    req: TypedRequestBody<{ email: string; name: string; password: string }>,
    res: Response
  ) => {
    const userData = req.body;
    const user = await prismaClient.user.create({
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

router.get("/", async (_, res: Response) => {
  const users = await prismaClient.user.findMany({
    select: { name: true, createdAt: true, id: true },
  });

  return res.status(200).json(users);
});

router.post(
  "/createApiKey",
  async (req: TypedRequestBody<{ userId: string }>, res: Response) => {
    const data = req.body;
    const user = await prismaClient.apiKey.create({
      data: { userId: data.userId },
    });
    res.status(200).json(user);
  }
);

export const userRoutes = router;
