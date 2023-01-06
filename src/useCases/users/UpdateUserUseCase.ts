import {
  CreateUserData,
  UserIdData,
  UsersRepository
} from '../../repositories/UsersRepository';

import { checkUsername } from '../../utils/checkers';

import { HttpCode } from '../../errors/HttpCode';
import { AppError } from '../../errors/AppError';

export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute({
    name,
    username,
    email,
    password,
    id
  }: CreateUserData & UserIdData) {
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

    if (!id) {
      throw new AppError({
        message: 'User not identified!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    await this.usersRepository.findById(id);

    await this.usersRepository.update({
      name,
      username,
      email,
      password,
      id
    });
  }
}
