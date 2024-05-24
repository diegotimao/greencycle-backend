import { Request, Response } from "express";

export interface IUser {
  id?: number,
  name: string,
  email: string,
  cpf: string,
  city: string,
  state: string,
  password_hash: string
}

export interface IUserController {
  getAll: (_req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  updated: (req: Request, res: Response) => Promise<void>;
}

export interface IUserService {
  getAll(): Promise<IUser[]>
  getById(id: number): Promise<IUser>
  create(user: IUser): Promise<IUser | string>
}

export interface IUserModel {
  getAll(): Promise<IUser[]>
  getById(id: number): Promise<IUser>
  create(user: IUser): Promise<IUser | string>
}