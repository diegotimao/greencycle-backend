import { IConfirmationTransacao, ITransacao } from "../interfaces/transacao.interface";
import connection from "../models/connection";
import TransacaoModel from "../models/transacao.model";

class TransacaoService {
  public model: TransacaoModel;

  constructor() {
    this.model = new TransacaoModel(connection);
  };

  public async create(transacao: ITransacao): Promise<ITransacao> {
    try {
      const transacaoResponse = await this.model.create(transacao);
      return transacaoResponse;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  public async getAllTransacaoUser(id_user: number): Promise<ITransacao[]> {
    try {
      const transacaoResponse = await this.model.getAllTransacaoUser(id_user);
      return transacaoResponse;  
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  // Confirmar a transacao como paga
  public async confirmationTrasacao(confirmation: IConfirmationTransacao): Promise<ITransacao> {
    try {
      const confirmationTransacao = await this.model.confirmationTransacao(confirmation);

      if (confirmationTransacao.status_payments !== 'Aprovado') {
        throw new Error("Não foi possivel aprovar a transação");
      };

      await this.convertToPointsAndBalance(confirmationTransacao);

      return confirmationTransacao;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };

  // converte real para pontos
  public async convertToPointsAndBalance(transacao: ITransacao): Promise<void> {
    try {
      const accountRows = await this.model.getAccount(transacao.id_user);
      const pointValue = 2;
      const totalAmount = transacao.total_price;
      const totalPoints = Math.floor(totalAmount / pointValue);
      const saldo = totalAmount % pointValue;

      await this.model.updatedAccount(accountRows, totalAmount, totalPoints, saldo, transacao.id_user);
    } catch (error: any) {
      throw new Error(error.message);
    };
  };
};

export default TransacaoService;