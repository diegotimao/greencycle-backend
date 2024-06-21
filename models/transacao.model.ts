import { FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IAccount, IConfirmationTransacao, ITransacao } from "../interfaces/transacao.interface";
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
      const dateNow = getLocalISOTime();
      const sqlTransacao = 'INSERT INTO transacao (id_user, id_ecoponto, txid, status_payments, total_price, data_transacao) VALUES (?, ?, ?, ?, ?, ?)';
      const valuesTransacao = [transacao.id_user, transacao.id_ecoponto, transacao.txid, transacao.status_payments, transacao.total_price, dateNow];
      const [transacaoResult] = await this.connection.execute<ResultSetHeader>(sqlTransacao, valuesTransacao);
      const transacaoId = (transacaoResult as any).insertId;

      const sqlItemInserts = 'INSERT INTO item_transacao (id_transacao, material, quilogramas, price) VALUES (?, ?, ?, ?)';

      for (const item of transacao.items) {
        await connection.execute<ResultSetHeader>(sqlItemInserts, [transacaoId, item.material, item.quilogramas, item.price]);
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
      };

      const transacao = rows[0] as ITransacao;

      if (transacao.status_payments === 'Aprovado') {
        throw new Error("A transação foi aprovada.")
      };

      const dateNow = getLocalISOTime();

      // Atualizar o status_payments para "Aprovado"
      const [updateResult]: [OkPacket, FieldPacket[]] = await this.connection.execute(
        'UPDATE transacao SET status_payments=?, data_aprovacao=? WHERE txid=?', 
        ['Aprovado', dateNow, txid]
      );

      if (updateResult.affectedRows !== 1) {
        throw new Error("Falha ao atualizar o status da transação!");
      };

      transacao.status_payments = 'Aprovado';
      transacao.data_aprovacao = dateNow;
      return transacao;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  // Retorna a conta do usuario
  public async getAccount(id_user: number): Promise<IAccount> {
    try {
      const [accountRows]: [RowDataPacket[], FieldPacket[]] = await this.connection.execute('SELECT * FROM account WHERE id_user=?', [id_user]);

      if (accountRows.length === 0) {
        throw new Error("Não existe conta com o id do useuario informado.");
      };

      return accountRows[0] as IAccount;
    } catch (error: any) {
      throw new Error("Não foi possivel buscar os dados da conta do usuário: " + error.message);
    };
  };

  // Atualisa a conta do usuário 
  public async updatedAccount(account: IAccount, totalAmount: number, totalPoints: number, saldo: number, id_user: number): Promise<void> {
    try {
      const newRealBalance = Number(account.real_balance) + Number(totalAmount);
      let newTotalPoints = account.total_points + totalPoints;
      let newSaldo = Number(account.saldo) + Number(saldo);
  
      // Verifica se o saldo acumulado é suficiente para comprar mais pontos
      if (newSaldo >= 2) {
        const pontosComprados = Math.floor(newSaldo / 2); // Quantidade de pontos a serem comprados
        newSaldo = newSaldo % 2; // Novo saldo após a compra dos pontos
        newTotalPoints += pontosComprados; // Adicionar os pontos comprados ao total de pontos
        console.log(`Compra de ${pontosComprados} pontos realizada.`);
      }
  
      await this.connection.execute('UPDATE account SET real_balance=?, total_points=?, saldo=? WHERE id_user=?',
        [
          newRealBalance,
          newTotalPoints,
          newSaldo,
          account.id_user
        ]
      );

      const accounts = await this.getAccount(id_user);
      console.log(accounts)
    } catch (error: any) {
      throw new Error("Não foi possível atualizar os valores da conta: " + error.message);
    };
  };
};

export default TransacaoModel;