import connection from "../models/connection";
import UserModel from "../models/user.model";
import { NotFoundError } from "restify-errors";
import BcryptService from "../utils/bcryptService";
import { IUser, IUserService } from "../interfaces/user.interface";
import AuthToken from "../utils/authToken";

class UserService implements IUserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  };

  public async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.model.login(email);
      if (!user) {
        throw new Error('Nâo existe usuário cadastrado com este email.')
      };
      const { password_hash } = user;
      const comparePassword = await new BcryptService().comparePassword(password, password_hash);
      if (!comparePassword) {
        throw new Error('A senha digitada esta incorreta.')
      };
      const token = await new AuthToken().generateToken(user);
      return token;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async getAll(): Promise<IUser[]> {
    try {
      const users = await this.model.getAll();
      return users;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async getById(id: number): Promise<IUser> {
    try {
      const user = await this.model.getById(id);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async create(user: IUser): Promise<IUser | string> {
    try {
      const { city, cpf, email, name, state } = user;
      const { password_hash } = user;
      const newPasswordHash = await new BcryptService().passwordHash(password_hash);
      const newUser: IUser = { password_hash: newPasswordHash, city, cpf, email, name, state };
      const resultUser = await this.model.create(newUser);
      const token = await new AuthToken().generateToken(resultUser as IUser);
      return token;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async updated(id: number, user: IUser): Promise<void> {
    try {
      const userFound = await this.model.getById(id);
      if (!userFound) {
        throw new NotFoundError('User not found');
      };
      return this.model.updated(id, user);
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async remove(id: number): Promise<boolean> {
    const user = await this.model.getById(id);
    if (!user) {
      return false;
    };
    await this.model.remove(id);
    return true;
  };

  public async getPointsAndQuilosUser(idUser: number): Promise<unknown> {
    try {
      return await this.model.getPointsAndQuilosUser(idUser);
    } catch (error: any) {
      throw new Error(error.message);  
    };
  };
};

export default UserService;