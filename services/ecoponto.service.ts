import { IEcoponto } from "../interfaces/ecoponto.interface";
import connection from "../models/connection";
import EcopontoModel from "../models/ecoponto.model";

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

  public async getById(id: number): Promise<IEcoponto[]> {
    try {
      const ecoponto = await this.model.getById(id);
      return ecoponto;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };
}