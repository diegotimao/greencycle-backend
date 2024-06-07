import { z } from "zod";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "restify-errors";

import UserService from "../services/user.service";
import { IUserController } from "../interfaces/user.interface";
import { User } from "../models/User";

class UserController implements IUserController {
  constructor(private userService = new UserService()) { };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      res.status(StatusCodes.OK).json({ 'token': token});
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ "error": error.message });
    };
  };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAll();
      res.status(StatusCodes.OK).json(users);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ "error": error.message });
    };
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getById(id);
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não cadastrado.' })
      };
      res.status(StatusCodes.OK).json(user)
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message});
    };
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.body;
      User.validate(user);
      const result = await this.userService.create(user);
      res.status(StatusCodes.CREATED).json({ token: result });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.CONFLICT).json({ message: error.errors[0].message});
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      };
    };
  };

  public updated = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = req.body;
      User.validate(user);
      await this.userService.updated(id, user);
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.CONFLICT).json({ message: error.errors[0].message});
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      };
    };
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'ID do usuário inálido' });
        return
      };
      const resultado = await this.userService.remove(id);
      if (resultado) {
        res.status(StatusCodes.NO_CONTENT).end();
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Usuário não existe.'});
      };
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Ocorreu um erro inesperado' });
      };
    };
  };
};

export default UserController;