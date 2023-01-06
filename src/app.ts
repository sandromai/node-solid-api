import express, { Request } from 'express';

import { usersRoutes } from './routes/users.routes';

import { errorHandler } from './middlewares/errorHandler';

import { HttpCode } from './errors/HttpCode';
import { AppError } from './errors/AppError';

const app = express();

app.use(express.json());

app.use('/users', usersRoutes);

app.use((request: Request) => {
  throw new AppError({
    message: `Route '${request.url}' not found`,
    httpCode: HttpCode.NOT_FOUND
  })
});

app.use(errorHandler);

const port = process.env.NODE_PORT;

app.listen(port, () =>
  console.log(`App listening on port ${port}.`)
);
