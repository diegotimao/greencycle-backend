import { StatusCodes } from "http-status-codes";
import EcopontoService from "../services/ecoponto.service";
import { Request, Response } from "express";
import { Ecoponto } from "../validations/Ecoponto";
import { z } from "zod";

export default class EcopontoController {
  constructor(private ecopontoService = new EcopontoService()) { };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ecopontos = await this.ecopontoService.getAll();
      res.status(StatusCodes.OK).json(ecopontos);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    };
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const ecoponto = await this.ecopontoService.getById(id);
      if (!ecoponto) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Ecoponto não cadastrado.'});
        return
      }
      res.status(StatusCodes.OK).json(ecoponto);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message});
    };
  };

  public remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'ID do ecoponto inálido' });
        return
      };
      const resultado = await this.ecopontoService.remove(id);
      if (resultado) {
        res.status(StatusCodes.NO_CONTENT).end();
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Ecoponto não cadastrado.'});
      };
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error: any) {
      res.status(StatusCodes.NO_CONTENT).json({ message: error.message });
    };
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const ecoponto = req.body;
      Ecoponto.validate(ecoponto);
      const token = await this.ecopontoService.create(ecoponto);
      res.status(StatusCodes.OK).json({ tpeken: token });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.CONFLICT).json({ message: error.errors[0].message});
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      };
    };
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const ecoponto = req.body;
      Ecoponto.validate(ecoponto);
      const newEcoponto = await this.ecopontoService.update(id, ecoponto);
      res.status(StatusCodes.OK).json(newEcoponto);
    } catch (error: any) {
      res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: error.message });
    };
  };
}; 




























