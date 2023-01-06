import { UsersRepository } from '../../repositories/UsersRepository';

import { HttpCode } from '../../errors/HttpCode';
import { AppError } from '../../errors/AppError';

export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute(id: number) {
    if (!id) {
      throw new AppError({
        message: 'User not identified!',
        httpCode: HttpCode.BAD_REQUEST
      });
    }

    await this.usersRepository.findById(id);
    await this.usersRepository.delete(id);
  }
}
