import express, { Response } from "express";
import { TypedRequestBody } from "./models";
import { prismaClient } from "../db/prisma";
import { User } from "@prisma/client";

const router = express.Router();

router.post(
  "/createType",
  async (req: TypedRequestBody<{ name: string }>, res: Response) => {
    const data = req.body;
    if (!req.user) return res.status(400);

    const userTypes = await prismaClient.eventType.findMany({
      where: { user: req.user },
    });

    if (userTypes.find((type) => type.name === data.name)) {
      return res
        .status(400)
        .send({ error: { code: 400, message: "type already exists." } });
    }

    const eventType = await prismaClient.eventType.create({
      data: { userId: req.user.id, name: data.name },
    });

    res.status(200).json(eventType);
  }
);

router.post(
  "/track",
  async (req: TypedRequestBody<{ eventTypeName: string }>, res: Response) => {
    const data = req.body;
    if (!req.user) return res.status(400);

    const eventType = await prismaClient.eventType.findFirst({
      where: { user: req.user, name: data.eventTypeName },
    });

    if (!eventType) {
      return res
        .status(404)
        .send({ error: { code: 404, message: "event doesn't exist." } });
    }

    const event = await prismaClient.event.create({
      data: { userId: req.user.id, eventTypeId: eventType.id },
    });

    res.status(200).json(event);
  }
);

export const eventRoutes = router;
