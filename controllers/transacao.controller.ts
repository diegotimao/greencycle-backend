import { Request, Response } from "express";
import TransacaoService from "../services/transacao.service";
import { StatusCodes } from "http-status-codes";

class TransacaoController {
  constructor(private transacaoService = new TransacaoService()) { };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const transacao = req.body;
      const transacaoResponse = await this.transacaoService.create(transacao);
      res.status(StatusCodes.OK).json(transacaoResponse);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({"error": error.message})
    };
  };
};

export default TransacaoController;