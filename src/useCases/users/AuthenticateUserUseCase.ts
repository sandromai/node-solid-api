import jwt from 'jsonwebtoken';

import { UsersRepository } from '../../repositories/UsersRepository';

import { HttpCode } from '../../errors/HttpCode';
import { AppError } from '../../errors/AppError';

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute(
    usernameOrEmail: string,
    password: string
  ) {
    if (!usernameOrEmail) {
      throw new AppError({
        message: 'Username or email are required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    if (!password) {
      throw new AppError({
        message: 'Password is required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    const { id } = await this.usersRepository.authenticate(
      usernameOrEmail,
      password
    );

    return jwt.sign(
      {
        createdAt: new Date().getTime(),
        expiresAt: new Date().getTime() + (7 * 24 * 60 * 60 * 1000),
        userId: id
      },
      process.env.JWT_SECRET,
      { noTimestamp: true }
    );
  }
}
