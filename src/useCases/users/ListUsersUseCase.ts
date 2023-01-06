import { UsersRepository } from '../../repositories/UsersRepository';

export class ListUsersUseCase {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute() {
    return await this.usersRepository.list();
  }
}
