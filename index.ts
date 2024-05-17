import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import 'express-async-errors';

const app = express();

app.use(express.json());

const PORT = 8080;

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Servidor ativo na porta 8080");
});

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