export interface IUser {
  id?: number,
  name: string,
  email: string,
  cpf: string,
  city: string,
  state: string,
  password_hash: string
}

export interface IUserService {
  create(user: IUser): Promise<IUser | string>
}

export interface IUserModel {
  create(user: IUser): Promise<IUser | string>
}