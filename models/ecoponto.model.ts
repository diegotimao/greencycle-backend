import { Pool, ResultSetHeader } from "mysql2/promise";
import { IEcoponto } from "../interfaces/ecoponto.interface";

export default class EcopontoModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  };

  public async getAll(): Promise<IEcoponto[]> {
    try {
      const result = await this.connection.execute('SELECT * FROM ecoponto');
      const [rows] = result;
      return rows as IEcoponto[]
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      };
      throw new Error("Falha ao buscar usuários!")
    };
  };

  public async getById(id: number): Promise<IEcoponto | boolean> {
    try {
      const result = await this.connection.execute('SELECT * FROM ecoponto WHERE id=?', [id]);
      const [rows] = result;
      const [ecoponto] = rows as IEcoponto[];
      if (ecoponto === undefined) {
        return false;
      }
      return ecoponto;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      }
      throw new Error('Falha ao buscar o usuário.');
    };
  };

  public async remove(id: number): Promise<boolean> {
    try {
      const [result] = await this.connection.execute('DELETE FROM ecoponto WHERE id=?', [id]);
      const affectedRows = (result as any).affectedRows;
      return affectedRows > 0;  
    } catch (error: any) {
      throw new Error(error.message);
    };
  };
};