import { IEcoponto } from "../interfaces/ecoponto.interface";
import connection from "../models/connection";
import EcopontoModel from "../models/ecoponto.model";
import AuthToken from "../utils/authToken";
import BcryptService from "../utils/bcryptService";
import { Ecoponto } from "../validations/Ecoponto";

export default class EcopontoService {
  public model: EcopontoModel;

  constructor() {
    this.model = new EcopontoModel(connection);
  };

  public async getAll(): Promise<IEcoponto[]> {
    try {
      const ecopontos = await this.model.getAll();
      return ecopontos;
    } catch (error: any) {
      throw new Error(error.message)
    };
  };

  public async getById(id: number): Promise<IEcoponto | boolean> {
    try {
      const ecoponto = await this.model.getById(id);
      return ecoponto;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async remove(id: number): Promise<boolean> {
    try {
      const ecoponto = await this.model.getById(id);
      if (!ecoponto) {
        return false;
      };
      await this.model.remove(id);
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async create(ecoponto: IEcoponto): Promise<string> {
    try {
      const { password_hash, name, cnpj, email, city, houseNumber, neighborhood, phone, road, state } = ecoponto;
      console.log(password_hash)
      const newPasswordHash = await new BcryptService().passwordHash(password_hash);
      const newEcoponto = { password_hash: newPasswordHash, name, cnpj, email, city, houseNumber, neighborhood, phone, road, state };
      const resultCreateEcoponto = await this.model.create(newEcoponto);
      const token = await new AuthToken().generateToken(resultCreateEcoponto as IEcoponto);
      return token;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async update(id: number, ecoponto: IEcoponto): Promise<IEcoponto> {
    try {
      const ecpontoUpdeted = await this.model.update(ecoponto); 
      return ecpontoUpdeted as IEcoponto;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };
}