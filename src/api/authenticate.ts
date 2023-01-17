import { NextFunction, Response, Request } from "express";
import { prismaClient } from "../db/prisma";
import { TAuthenticated, TypedRequestBody } from "../routes/models";

export const authenticateKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res
      .status(403)
      .send({ error: { code: 403, message: "Api key missing." } });
  }

  const user = await prismaClient.user.findFirst({
    where: { ApiKey: { some: { apiKey } } },
  });

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).send({ error: { code: 403, message: "You not allowed." } });
  }
};
