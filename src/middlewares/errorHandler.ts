import path from 'path';

import {
  Request,
  Response,
  NextFunction
} from 'express';

import { AppError } from '../errors/AppError';
import { DatabaseError } from '../errors/DatabaseError';

import { saveLog } from '../utils/logs';

export function errorHandler(
  error: AppError | DatabaseError | Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    saveLog(
      path.resolve(__dirname, '..', 'logs', 'appErrors.log'),
      error.message
    );
  
    return response.status(error.httpCode).json({
      message: error.message
    });
  }

  if (error instanceof DatabaseError) {
    saveLog(
      path.resolve(__dirname, '..', 'logs', 'databaseErrors.log'),
      error.details ? `${error.message} -> ${error.details}` : error.message
    );
  
    return response.status(error.httpCode).json({
      message: error.message
    });
  }

  saveLog(
    path.resolve(__dirname, '..', 'logs', 'errors.log'),
    error.message
  );

  return response.status(500).json({
    message: error.message
  });
}
