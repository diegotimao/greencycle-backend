import { NextFunction, Request, Response } from "express";
import AuthToken from "../utils/authToken";
import { StatusCodes } from "http-status-codes";

export default async function AuttenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.query.authorization;

    if (token === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Você precisa estar autenticado para realizar esta ação.'})
    }
 
    if (typeof token !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Formato do token inválido.' })
    }
    const role = await new AuthToken().autenticatorToken(token as string);
    (req as any).user = { role };
    next();
  } catch (error: any) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ messsage: error.message})
  }
}