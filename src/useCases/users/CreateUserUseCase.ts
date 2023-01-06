import { CreateUserData, UsersRepository } from '../../repositories/UsersRepository';

import { MailAdapter } from '../../adapters/MailAdapter';

import { checkUsername } from '../../utils/checkers';

import { HttpCode } from '../../errors/HttpCode';
import { AppError } from '../../errors/AppError';

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailAdapter: MailAdapter
  ) {}

  async execute({
    name,
    username,
    email,
    password
  }: CreateUserData) {
    if (!name) {
      throw new AppError({
        message: 'Name is required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    if (!username) {
      throw new AppError({
        message: 'Username is required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    if (!checkUsername(username)) {
      throw new AppError({
        message: 'Invalid username!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    if (!email) {
      throw new AppError({
        message: 'Email is required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    if (!password) {
      throw new AppError({
        message: 'Password is required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    const { id } = await this.usersRepository.create({
      name,
      username,
      email,
      password
    });

    this.mailAdapter.sendMail({
      from: 'example@example.com',
      to: email,
      subject: 'Welcome!',
      body: '<h1>Welcome!</h1>'
    });

    return id;
  }
}
