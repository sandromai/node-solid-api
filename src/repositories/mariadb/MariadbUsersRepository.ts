import * as bcrypt from 'bcrypt';
import { PoolConnection } from 'mariadb';

import { createOrRefreshConnection } from '../../mariadb';

import {
  User,
  CreateUserData,
  UserIdData,
  UsersRepository
} from '../UsersRepository';

import { HttpCode } from '../../errors/HttpCode';
import { DatabaseError } from '../../errors/DatabaseError';

export class MariadbUsersRepository implements UsersRepository {
  private connection: PoolConnection | undefined;

  private async checkIfUsernameIsAlreadyRegistered(
    username: string,
    excludeId = 0
  ): Promise<boolean> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const result = await this.connection.query(
        "SELECT `id` FROM `users` WHERE `username` = ? AND `id` != ? LIMIT 1",
        [username, excludeId]
      );

      if (result.length && parseInt(result[0].id)) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Error on UsersRepository.checkIfUsernameIsAlreadyRegistered(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  private async checkIfEmailIsAlreadyRegistered(
    email: string,
    excludeId = 0
  ): Promise<boolean> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const result = await this.connection.query(
        "SELECT `id` FROM `users` WHERE `email` = ? LIMIT 1",
        [email, excludeId]
      );

      if (result.length && parseInt(result[0].id)) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Error on UsersRepository.checkIfEmailIsAlreadyRegistered(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  async list(): Promise<User[]> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const result = await this.connection.query(
        "SELECT * FROM `users` ORDER BY `id` DESC"
      );

      const users = result.map((row: any) => {
        delete row.password;

        return row;
      }) as User[];

      return users;
    } catch (error) {
      throw new Error(`Error on UsersRepository.list(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  async findById(id: number): Promise<User> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const result = await this.connection.query(
        "SELECT * FROM `users` WHERE `id` = ? LIMIT 1",
        [id]
      );

      if (result.length !== 1) {
        throw new DatabaseError({
          message: 'User not found!',
          httpCode: HttpCode.NOT_FOUND
        });
      }

      delete result[0].password;

      return result[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError({
          message: error.message,
          httpCode: error.httpCode
        });
      }

      throw new DatabaseError({
        message: 'Error on UsersRepository.findById()',
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        details: error.message
      });
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  async create({
    name,
    username,
    email,
    password
  }: CreateUserData): Promise<UserIdData> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const usernameAlreadyRegistered = await this.checkIfUsernameIsAlreadyRegistered(username);

      if (usernameAlreadyRegistered) {
        throw new Error('This username is already registered!');
      }

      const emailAlreadyRegistered = await this.checkIfEmailIsAlreadyRegistered(email);

      if (emailAlreadyRegistered) {
        throw new Error('This email address is already registered!');
      }

      const encryptedPassword = await bcrypt.hash(password, 12);

      const result = await this.connection.query(
        "INSERT INTO `users` (`name`, `username`, `email`, `password`) VALUES (?, ?, ?, ?)",
        [name, username, email, encryptedPassword]
      );

      return {
        id: parseInt(result.insertId)
      };
    } catch (error) {
      throw new Error(`Error on UsersRepository.create(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  async update({
    name,
    username,
    email,
    password,
    id
  }: CreateUserData & UserIdData): Promise<void> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const usernameAlreadyRegistered = await this.checkIfUsernameIsAlreadyRegistered(username, id);

      if (usernameAlreadyRegistered) {
        throw new Error('This username is already registered!');
      }

      const emailAlreadyRegistered = await this.checkIfEmailIsAlreadyRegistered(email, id);

      if (emailAlreadyRegistered) {
        throw new Error('This email address is already registered!');
      }

      if (password) {
        const encryptedPassword = await bcrypt.hash(password, 12);

        await this.connection.query(
          "UPDATE `users` SET `name` = ?, `username` = ?, `email` = ?, `password` = ? WHERE `id` = ?",
          [name, username, email, encryptedPassword, id]
        );
      } else {
        await this.connection.query(
          "UPDATE `users` SET `name` = ?, `username` = ?, `email` = ? WHERE `id` = ?",
          [name, username, email, id]
        );
      }
    } catch (error) {
      throw new Error(`Error on UsersRepository.update(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  async updatePassword(
    password: string,
    id: number
  ): Promise<void> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const encryptedPassword = await bcrypt.hash(password, 12);

      await this.connection.query(
        "UPDATE `users` SET `password` = ? WHERE `id` = ?",
        [encryptedPassword, id]
      );
    } catch (error) {
      throw new Error(`Error on UsersRepository.updatePassword(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }

  async authenticate(
    usernameOrEmail: string,
    password: string
  ): Promise<UserIdData> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      const result = await this.connection.query(
        "SELECT `id`, `password` FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1",
        [usernameOrEmail, usernameOrEmail]
      );

      if (!result.length || !parseInt(result[0].id)) {
        throw new Error('Incorrect username, email or password!');
      }

      const passwordCheck = await bcrypt.compare(password, result[0].password);

      if (!passwordCheck) {
        throw new Error('Incorrect username, email or password!');
      }

      return {
        id: parseInt(result[0].id)
      };
    } catch (error) {
      throw new Error(`Error on UsersRepository.authenticate(): ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      this.connection = await createOrRefreshConnection(
        this.connection
      );

      await this.connection.query(
        "DELETE FROM `users` WHERE `id` = ?",
        [id]
      );
    } catch (error) {
      throw new Error(`Error on UsersRepository.delete(): ${error.message}`);
    } finally {
      if (this.connection) {
        this.connection.end();
      }
    }
  }
}
