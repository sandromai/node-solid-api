import { Router } from 'express';

import { MariadbUsersRepository } from '../repositories/mariadb/MariadbUsersRepository';

import { NodemailerMailAdapter } from '../adapters/nodemailer/NodemailerMailAdapter';

import { ListUsersUseCase } from '../useCases/users/ListUsersUseCase';
import { FindUserByIdUseCase } from '../useCases/users/FindUserByIdUseCase';
import { CreateUserUseCase } from '../useCases/users/CreateUserUseCase';
import { UpdateUserUseCase } from '../useCases/users/UpdateUserUseCase';
import { UpdateUserPasswordUseCase } from '../useCases/users/UpdateUserPasswordUseCase';
import { AuthenticateUserUseCase } from '../useCases/users/AuthenticateUserUseCase';
import { DeleteUserUseCase } from '../useCases/users/DeleteUserUseCase';

import { ensureUserAuthentication } from '../middlewares/ensureUserAuthentication';

const usersRepository = new MariadbUsersRepository();

const usersRoutes = Router();

usersRoutes.get('/list/', async (request, response, next) => {
  try {
    const listUsersUseCase = new ListUsersUseCase(
      usersRepository
    );

    const users = await listUsersUseCase.execute();

    return response.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

usersRoutes.get('/find/:id', async (request, response, next) => {
  try {
    const { id } = request.params;

    const findUserByIdUseCase = new FindUserByIdUseCase(
      usersRepository
    );

    const user = await findUserByIdUseCase.execute(
      parseInt(id)
    );

    return response.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

usersRoutes.post('/create/', async (request, response, next) => {
  try {
    const {
      name,
      username,
      email,
      password
    } = request.body;

    const mailAdapter = new NodemailerMailAdapter();

    const createUserUseCase = new CreateUserUseCase(
      usersRepository,
      mailAdapter
    );

    const userId = await createUserUseCase.execute({
      name,
      username,
      email,
      password
    });

    return response.status(201).json({
      id: userId,
      name,
      username,
      email
    });
  } catch (error) {
    next(error);
  }
});

usersRoutes.put('/update/', ensureUserAuthentication, async (request, response, next) => {
  try {
    const {
      name,
      username,
      email,
      password
    } = request.body;

    const updateUserUseCase = new UpdateUserUseCase(
      usersRepository
    );

    await updateUserUseCase.execute({
      name,
      username,
      email,
      password,
      id: request.userId
    });

    return response.status(200).json({
      message: 'User successfully updated!'
    });
  } catch (error) {
    next(error);
  }
});

usersRoutes.put('/updatePassword/', ensureUserAuthentication, async (request, response, next) => {
  try {
    const { password } = request.body;

    const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
      usersRepository
    );

    await updateUserPasswordUseCase.execute(
      password,
      request.userId
    );

    return response.status(200).json({
      message: 'User password successfully updated!'
    });
  } catch (error) {
    next(error);
  }
});

usersRoutes.post('/authenticate/', async (request, response, next) => {
  try {
    const { usernameOrEmail, password } = request.body;

    const authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository
    );

    const token = await authenticateUserUseCase.execute(
      usernameOrEmail,
      password
    );

    return response.status(200).json({
      token
    });
  } catch (error) {
    next(error);
  }
});

usersRoutes.delete('/delete/:id', async (request, response, next) => {
  try {
    const { id } = request.params;

    const deleteUserUseCase = new DeleteUserUseCase(
      usersRepository
    );

    await deleteUserUseCase.execute(
      parseInt(id)
    );

    return response.status(200).json({
      message: 'User successfully deleted!'
    });
  } catch (error) {
    next(error);
  }
});

export { usersRoutes };
