import connection from "../models/connection";
import UserModel from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

class UserService {
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
}

export default UserService;