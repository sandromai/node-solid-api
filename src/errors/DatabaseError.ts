import { HttpCode } from './HttpCode';

interface DatabaseErrorArgs {
  message: string;
  httpCode: number;
  details?: string;
}

export class DatabaseError extends Error {
  public readonly details: string | undefined;
  public readonly httpCode: HttpCode;

  constructor({ message, details, httpCode }: DatabaseErrorArgs) {
    super(message);

    this.details = details;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}