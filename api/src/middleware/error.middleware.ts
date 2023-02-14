import { CelebrateError } from "celebrate";
import { Request, Response, NextFunction } from "express";
import {
  InvalidTokenError,
  UnauthorizedError,
} from "express-oauth2-jwt-bearer";

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error) {
    console.log(request.headers, error);
  }

  if (error instanceof InvalidTokenError) {
    const message = "InvalidTokenError";

    response.status(error.status).json({ message });

    return;
  }

  if (error instanceof UnauthorizedError) {
    const message = "UnauthorizedError";

    response.status(error.status).json({ message });

    return;
  }

  const status = 500;
  const message = "Internal Server Error";

  response.status(status).json({ message });
};
