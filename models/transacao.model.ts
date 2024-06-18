import { Pool, ResultSetHeader } from "mysql2/promise";
import { ITransacao } from "../interfaces/transacao.interface";

class TransacaoModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  };

  public async create(transacao: ITransacao): Promise<ITransacao> {
    const connection = await this.connection.getConnection();
    try {      
      await connection.beginTransaction();

      const sqlTransacao = 'INSERT INTO transacao (id_user, id_ecoponto, txid, status_payments, total_price) VALUES (?, ?, ?, ?, ?)';
      const valuesTransacao = [transacao.id_user, transacao.id_ecoponto, transacao.txid, transacao.status_payments, transacao.total_price];
      const [transacaoResult] = await this.connection.execute<ResultSetHeader>(sqlTransacao, valuesTransacao);
      const transacaoId = (transacaoResult as any).insertId;

      const sqlItemInserts = 'INSERT INTO item_transacao (id_transacao, material, quilogramas, price) VALUES (?, ?, ?, ?)'; 

      for(const item of transacao.items) {
        await connection.execute<ResultSetHeader>(sqlItemInserts, [transacaoId, item.material, item.quilogramas, item.price])
      }

      await connection.commit();

      return {id: transacaoId, ...transacao};
    } catch (error: any) {
      await connection.rollback();
      throw new Error(error.message);
    } finally {
      connection.release();  
    };
  };
};

export default TransacaoModel;