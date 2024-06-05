import { StatusCodes } from "http-status-codes";
import EcopontoService from "../services/ecoponto.service";
import { Request, Response } from "express";

export default class EcopontoController {
  constructor(private ecopontoService = new EcopontoService()) { };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ecopontos = await this.ecopontoService.getAll();
      res.status(StatusCodes.OK).json(ecopontos);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    }
  }
};