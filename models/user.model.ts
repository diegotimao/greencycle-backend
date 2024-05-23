import { Pool, ResultSetHeader } from "mysql2/promise";
import { IUser } from "../interfaces/user.interface";

class UserModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<IUser[]> {
    const result = await this.connection.execute('SELECT * FROM users');
    const [rows] = result;
    return rows as IUser[];
  }

  public async create(user: IUser): Promise<IUser | string> {
    try {
      const { name, email, cpf, city, state, password_hash } = user;

      if (await this.userExists('cpf', user.cpf)) {
        throw new Error('CPF already exists!');
      }

      if (await this.userExists('email', user.email)) {
        throw new Error('Email already exists!');
      }

      const sql = 'INSERT INTO users (name, email, cpf, city, state, password_hash) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [name, email, cpf, city, state, password_hash];
      const [result] = await this.connection.execute<ResultSetHeader>(sql, values);

      if (result.affectedRows > 0) {
        return { id: result.insertId, ...user };
      }

      throw new Error('Error creating user');
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async userExists(field: string, value: string): Promise<boolean> {
    const [rows] = await this.connection.execute(`SELECT ${field} FROM users WHERE ${field} = ?`, [value]);
    return Array.isArray(rows) && rows.length > 0;
  }
}

export default UserModel;