import { User } from "@prisma/client";

export type TAuthenticated<T> = T & { user: User };

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
  user?: User;
}
