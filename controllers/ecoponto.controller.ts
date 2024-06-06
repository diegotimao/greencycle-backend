import { StatusCodes } from "http-status-codes";
import EcopontoService from "../services/ecoponto.service";
import { Request, Response } from "express";
import { IEcoponto } from "../interfaces/ecoponto.interface";

export default class EcopontoController {
  constructor(private ecopontoService = new EcopontoService()) { };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ecopontos = await this.ecopontoService.getAll();
      res.status(StatusCodes.OK).json(ecopontos);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    };
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const ecoponto = await this.ecopontoService.getById(id);
      res.status(StatusCodes.OK).json(ecoponto);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message});
    };
  };
};