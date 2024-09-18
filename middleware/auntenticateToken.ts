import { NextFunction, Request, Response } from "express";
import AuthToken from "../utils/authToken";
import { StatusCodes } from "http-status-codes";

export default async function AutenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Você precisa estar autenticado para realizar esta ação.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || !token.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Você precisa estar autenticado para realizar esta ação.' });
    }

    const authToken = new AuthToken();
    const role = await authToken.autenticatorToken(token);

    // Log para depuração
    console.log("Token:", token);
    console.log("Role recebido:", role);

    // Verifica se role existe e tem a propriedade id
    if (!role || typeof role.id !== 'number') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token inválido ou usuário não autenticado.' });
    }

    // Converte req.params.id para um número e verifica se é válido
    const requestedUserId = Number(req.params.id);
    if (isNaN(requestedUserId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'ID de usuário inválido.' });
    }

    // Verifica se o role.id é diferente do requestedUserId
    if (role.id !== requestedUserId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Você não tem autorização para acessar os dados." });
    }

    // Adiciona o role ao objeto req
    (req as any).user = { role };
    next();
  } catch (error: any) {
    // Log para depuração de erros
    console.error("Erro ao autenticar token:", error);

    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Erro ao autenticar token: ' + error.message });
  }
}
