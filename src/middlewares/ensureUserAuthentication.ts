import {
  Request,
  Response,
  NextFunction
} from 'express';

import { verify } from 'jsonwebtoken';

interface IUserJsonWebToken {
  createdAt: number;
  expiresAt: number;
  userId: number;
}

export function ensureUserAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      message: 'Authorization token not provided'
    });
  }

  const [, token] = authToken.split(' ');

  try {
    const payload = verify(
      token,
      process.env.JWT_SECRET
    ) as IUserJsonWebToken;

    if (new Date().getTime() > payload.expiresAt) {
      return response.status(401).json({
        message: 'Expired token'
      });
    }

    request.userId = payload.userId;

    return next();
  } catch {
    return response.status(401).json({
      message: 'Invalid token'
    });
  }
}
