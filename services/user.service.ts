import connection from "../models/connection";
import UserModel from "../models/user.model";
import User from "../interfaces/user.interface";

class UserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  }

  public async getAll(): Promise <User[]> {
    const users = await this.model.getAll();
    return users;
  }
}

export default UserService;