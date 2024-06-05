import { IEcoponto } from "../interfaces/ecoponto.interface";
import connection from "../models/connection";
import EcopontoModel from "../models/ecoponto.model";

export default class EcopontoService {
  public model: EcopontoModel;

  constructor() {
    this.model = new EcopontoModel(connection)
  }

  public async getAll(): Promise<IEcoponto[]> {
    try {
      const resuslt = await this.model.getAll();
      return resuslt;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}