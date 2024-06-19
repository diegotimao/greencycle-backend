import { Request, Response } from "express";
import { z } from "zod";
import TransacaoService from "../services/transacao.service";
import { StatusCodes } from "http-status-codes";
import { Transacao } from "../validations/Transacao";

class TransacaoController {
  constructor(private transacaoService = new TransacaoService()) { };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const transacao = req.body;
      Transacao.validate(transacao);
      const transacaoResponse = await this.transacaoService.create(transacao);
      res.status(StatusCodes.OK).json(transacaoResponse);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.CONFLICT).json({ message: error.errors[0].message});
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      };
    };
  };
};

export default TransacaoController;