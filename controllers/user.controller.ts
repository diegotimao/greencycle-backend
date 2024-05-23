import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/user.service";

class UserController {
  constructor(private userService = new UserService()) { }

  public getAll = async (_req: Request, res: Response) => {
    const users = await this.userService.getAll();
    res.status(StatusCodes.OK).json(users);
  }

  public create = async (req: Request, res: Response) => {
    try {
      const user = req.body;
      const result = await this.userService.create(user);
      if (typeof result === 'string') {
        return res.status(StatusCodes.CONFLICT).json({ message: result });
      }
      return res.status(StatusCodes.CREATED).json(result);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
  }
}

export default UserController;