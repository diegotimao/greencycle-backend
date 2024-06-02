import connection from "../models/connection";
import UserModel from "../models/user.model";
import { NotFoundError } from "restify-errors";
import BcryptService from "../utils/bcryptService";
import { IUser, IUserService } from "../interfaces/user.interface";

class UserService implements IUserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  }

  public async getAll(): Promise<IUser[]> {
    try {
      const users = await this.model.getAll();
      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getById(id: number): Promise<IUser> {
    try {
      const user = await this.model.getById(id);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async create(user: IUser): Promise<IUser | string> {
    const { city, cpf, email, name, state } = user;
    let { password_hash } = user;
    const newPasswordHash = await new BcryptService().passwordHash(password_hash);
    const newUser: IUser = { password_hash: newPasswordHash, city, cpf, email, name, state };
    return this.model.create(newUser);
  }

  public async updated(id: number, user: IUser): Promise<void> {
    const userFound = await this.model.getById(id);
    if (!userFound) {
      throw new NotFoundError('User notfound');
    }
    return this.model.updated(id, user);
  }

  public async remove(id: number): Promise<boolean> {
    const user = await this.model.getById(id);
    if (!user) {
      return false;
    }
    await this.model.remove(id);
    return true;
  }
}

export default UserService;