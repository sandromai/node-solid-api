import { HttpCode } from './HttpCode';

interface AppErrorArgs {
  message: string;
  httpCode: HttpCode;
}

export class AppError extends Error {
  public readonly httpCode: HttpCode;

  constructor({ message, httpCode }: AppErrorArgs) {
    super(message);

    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}
