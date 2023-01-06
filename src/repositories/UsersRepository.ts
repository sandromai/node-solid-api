export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  created_at: string;
}

export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserIdData {
  id: number;
}

export interface UsersRepository {
  list(): Promise<User[]>;
  findById(id: number): Promise<User>;
  create(data: CreateUserData): Promise<UserIdData>;
  update(data: CreateUserData & UserIdData): Promise<void>;
  updatePassword(password: string, id: number): Promise<void>;
  authenticate(usernameOrEmail: string, password: string): Promise<UserIdData>;
  delete(id: number): Promise<void>;
}
