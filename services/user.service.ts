import connection from "../models/connection";
import UserModel from "../models/user.model";
import { IUser, IUserService } from "../interfaces/user.interface";
import { NotFoundError } from "restify-errors";

class UserService implements IUserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  }

  public async getAll(): Promise <IUser[]> {
    const users = await this.model.getAll();
    return users;
  }

  public async getById(id: number): Promise<IUser> {
    const user = await this.model.getById(id);
    return user;
  }

  public async create(user: IUser): Promise <IUser | string> {
    return this.model.create(user);
  }

  public async updated(id: number, user: IUser): Promise<void> {
    const userFound = await this.model.getById(id);

    if (!userFound) {
      throw new NotFoundError('User notfound')
    }

    return this.model.updated(id, user);
  }
}

export default UserService;