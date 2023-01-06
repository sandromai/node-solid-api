import { UsersRepository } from '../../repositories/UsersRepository';

export class FindUserByIdUseCase {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute(id: number) {
    return await this.usersRepository.findById(id);
  }
}
