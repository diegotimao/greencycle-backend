import { Pool, ResultSetHeader } from "mysql2/promise";
import { IEcoponto } from "../interfaces/ecoponto.interface";

export default class EcopontoModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<IEcoponto[]> {
    try {
      const result = await this.connection.execute('SELECT * FROM ecoponto');
      const [rows] = result;
      return rows as IEcoponto[]
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      }
      throw new Error("Falha ao buscar usuários!")
    }
  }
}