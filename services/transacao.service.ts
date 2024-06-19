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

  public async confirmationTrasacao(confirmation: IConfirmationTransacao): Promise<ITransacao> {
    try {
      const confirmationResponse = await this.model.confirmationTransacao(confirmation);
      
      if (confirmationResponse.status_payments !== 'Aprovado') {
        throw new Error("Não foi possivel aprovar a transação");
      }

      // buscar os dados da conta do usuario 
      

      return confirmationResponse;
    } catch (error: any) {
      throw new Error(error.message);
    };
  };
};

export default TransacaoService;