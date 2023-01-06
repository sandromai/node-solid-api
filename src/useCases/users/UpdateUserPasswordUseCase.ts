import { UsersRepository } from '../../repositories/UsersRepository';

import { HttpCode } from '../../errors/HttpCode';
import { AppError } from '../../errors/AppError';

export class UpdateUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute(password: string, id: number) {
    if (!password) {
      throw new AppError({
        message: 'Password is required!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    if (!id) {
      throw new AppError({
        message: 'User not identified!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError({
        message: 'User not found!',
        httpCode: HttpCode.NOT_FOUND
      });
    }

    await this.usersRepository.updatePassword(
      password,
      id
    );
  }
}
