import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/user.service";
import { IUserController } from "../interfaces/user.interface";
import { NotFoundError } from "restify-errors";

class UserController implements IUserController {
  constructor(private userService = new UserService()) { }

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAll();
    res.status(StatusCodes.OK).json(users);
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const user = await this.userService.getById(id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found!' })
    }
    res.status(StatusCodes.OK).json(user)
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.body;
      const result = await this.userService.create(user);
      if (typeof result === 'string') {
        res.status(StatusCodes.CONFLICT).json({ message: result });
      }
      res.status(StatusCodes.CREATED).json(result);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
  }

  public updated = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = req.body;
      await this.userService.updated(id, user);
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json(error.message)
    }
  }

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'ID do usuário inálido' });
        return
      }
      const resultado = await this.userService.remove(id);
      if (resultado) {
        res.status(StatusCodes.NO_CONTENT).end();
      } else {
        throw new NotFoundError('Usuário não encontrado');
      }
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Ocorreu um erro inesperado' });
      }
    }
  }
}

export default UserController;