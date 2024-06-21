import { FieldPacket, Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IUser } from "../interfaces/user.interface";

class UserModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async login(email: string): Promise<IUser> {
    try {
      const result = await this.connection.execute('SELECT id, name, email, city, password_hash FROM users WHERE email=?', [email]);
      const [rows] = result;
      const [user] = rows as IUser[];
      return user;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      }
      throw new Error("Falha ao buscar usuários!")
    }
  }

  public async getAll(): Promise<IUser[]> {
    try {
      const result = await this.connection.execute('SELECT id, name, email, cpf, state, city FROM users');
      const [rows] = result;
      return rows as IUser[];
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      }
      throw new Error("Falha ao buscar usuários!")
    }
  }

  public async getById(id: number): Promise<IUser> {
    try {
      const result = await this.connection.execute('SELECT id, name, email, cpf, state, city FROM users WHERE id=?', [id]);
      const [rows] = result;
      const [user] = rows as IUser[];
      return user;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      }
      throw new Error("Falha ao buscar usuários!")
    }
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
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Falha ao conectar ao banco de dados. Por favor tente mais tarde!');
      }
      throw new Error(error.message);
    }
  }

  public async updated(id: number, user: IUser) {
    try {
      const { name, email, cpf, city, state, password_hash } = user;

      await this.connection.execute(
        'UPDATE users SET name=?, email=?, cpf=?, city=?, state=?, password_hash=? WHERE id=?', [name, email, cpf, city, state, password_hash, id]
      )
    } catch (error: any) {
      throw new Error(error.message)
    }
  };

  public async remove(id: number): Promise<boolean> {
    try {
      const [result] = await this.connection.execute('DELETE FROM users WHERE id=?', [id])
      const affectedRows = (result as any).affectedRows;
      return affectedRows > 0;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  private async userExists(field: string, value: string): Promise<boolean> {
    const [rows] = await this.connection.execute(`SELECT ${field} FROM users WHERE ${field} = ?`, [value]);
    return Array.isArray(rows) && rows.length > 0;
  };

  public async getPointsAndQuilosUser(idUser: number): Promise<unknown> {
    try {
      const [pointsRows]: [RowDataPacket[], FieldPacket[]] = await this.connection.execute('SELECT total_points AS Pontos FROM account WHERE id_user=?', [idUser]);
      const points = pointsRows[0]?.Pontos || 0;
      
      const [quilosRows]: [RowDataPacket[], FieldPacket[]] = await this.connection.execute(
        'SELECT FORMAT(SUM(item_transacao.quilogramas), 0) AS Kg FROM item_transacao INNER JOIN transacao ON item_transacao.id = transacao.id WHERE transacao.id_user=?',
        [idUser]
      );

      const quilos = quilosRows[0]?.Kg || 0;

      return { points, quilos };
    } catch (error: any) {
      throw new Error(error.message)  
    };
  };
};

export default UserModel;