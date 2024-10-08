import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import 'express-async-errors';

import UsersRoutes from './routes/user.routes';
import EcopontoRoutes from './routes/ecoponto.routes';
import TransacaoRoutes from './routes/transacao.routes';

const app = express();

app.use(express.json());

const PORT = 8080;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Servidor ativo na porta 8080");
});

app.use(UsersRoutes);
app.use(EcopontoRoutes);
app.use(TransacaoRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  const { name, message, details } = err as any;
  console.log(`name: ${name}`);

  switch (name) {
    case 'ValidationError':
      res.status(400).json({ message: details[0].message});
      break;
    case 'NotFoundError': 
      res.status(404).json({ message });
      break;
    default:
      console.error(err);
      res.sendStatus(500)
  }
  next();
})

app.listen(PORT, () => {
  console.log(`Server is runing at http://localhost:${PORT}`);
});