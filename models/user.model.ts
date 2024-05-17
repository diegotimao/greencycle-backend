import { Pool, ResultSetHeader } from "mysql2/promise";
import User from "../interfaces/user.interface";

class UserModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<User[]> {
    const result = await this.connection.execute('SELECT * FROM users');
    const [rows] = result;
    return rows as User[];
  }
} 

export default UserModel;