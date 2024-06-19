import { FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IConfirmationTransacao, ITransacao } from "../interfaces/transacao.interface";
import getLocalISOTime from "../utils/getDateNow";

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

      for (const item of transacao.items) {
        await connection.execute<ResultSetHeader>(sqlItemInserts, [transacaoId, item.material, item.quilogramas, item.price])
      }

      await connection.commit();

      return { id: transacaoId, ...transacao };
    } catch (error: any) {
      await connection.rollback();
      throw new Error(error.message);
    } finally {
      connection.release();
    };
  };

  public async confirmationTransacao(confirmation: IConfirmationTransacao): Promise<ITransacao> {
    try {
      const { txid } = confirmation;

      // Verificar se a transação existe
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this.connection.execute('SELECT * FROM transacao WHERE txid=?', [txid]);

      if (rows.length === 0) {
        throw new Error("Não existe uma transação com o txid informado!");
      }

      const transacao = rows[0] as ITransacao;
      const dateNow = getLocalISOTime();

      // Atualizar o status_payments para "Aprovado"
      const [updateResult]: [OkPacket, FieldPacket[]] = await this.connection.execute('UPDATE transacao SET status_payments=?, data_aprovacao=? WHERE txid=?', ['Aprovado', dateNow, txid]);

      if (updateResult.affectedRows !== 1) {
        throw new Error("Falha ao atualizar o status da transação!");
      }

      transacao.status_payments = 'Aprovado';
      transacao.data_aprovacao = dateNow;
      return transacao;
    } catch (error: any) {
      throw new Error("Não foi possível confirmar a transação: " + error.message);
    };
  };

};

export default TransacaoModel;