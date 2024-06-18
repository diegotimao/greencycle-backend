import { ITransacao } from "../interfaces/transacao.interface";
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
};

export default TransacaoService;