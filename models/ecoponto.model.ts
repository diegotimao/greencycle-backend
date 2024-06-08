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

  public async create(ecoponto: IEcoponto): Promise<IEcoponto> {
    try {
      const { name, cnpj, city, email, houseNumber, neighborhood, password_hash, phone, road, state } = ecoponto;
      
      if (await this.ecopontoExists('cnpj', cnpj)) {
        throw new Error('Já existe uma conta cadastrada com este CNPJ.');
      };

      if (await this.ecopontoExists('email', email)) {
        throw new Error('Já existe uma conta cadastrada com este E-mail.')
      }

      const sql = 'INSERT INTO ecoponto (name, cnpj, city, email, houseNumber, neighborhood, password_hash, phone, road, state) VALUES (?,?,?,?,?,?,?,?,?,?)'
      const values = [name, cnpj, city, email, houseNumber, neighborhood, password_hash, phone, road, state];
      const [result] = await this.connection.execute<ResultSetHeader>(sql, values);
      
      if (result.affectedRows > 0) {
        return { id: result.insertId, ...ecoponto };
      };

      throw new Error('Erro ao cadastrar ecoponto, por favor tente novamente.')
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async update(ecoponto: IEcoponto): Promise<IEcoponto | undefined> {
    try {
      const { name, cnpj, email, city, houseNumber, neighborhood, phone, road, state, id } = ecoponto;
      const sql = 'UPDATE ecoponto SET name=?, cnpj=?, road=?, houseNumber=?, city=?, neighborhood=?, state=?, phone=?, email=? WHERE id=?';
      const values = [name, cnpj, road, houseNumber, city, neighborhood, state, phone, email, id];
      const [resultUpdate]: any = await this.connection.execute(sql, values);
      const affectedRows = resultUpdate.affectedRows;
      if (affectedRows > 0) {
        return ecoponto;
      }
    } catch (error: any) {
      throw new Error(`Error updating ecoponto: ${error.message}`);
    }
  }
  

  public async ecopontoExists(field: string, value: string) {
    try {
      const [rows] = await this.connection.execute(`SELECT ${field} FROM ecoponto WHERE ${field} = ?`, [value]);
      return Array.isArray(rows) && rows.length > 0;
    } catch (error) {
      throw new Error('Não foi possivel concluir a busca.')
    }
  }
}; 