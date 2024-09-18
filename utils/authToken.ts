import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';
import { IEcoponto } from '../interfaces/ecoponto.interface';

const SECRET = process.env.JWT_SECRET || 'jwt_secret';

const jwtDefaultConfig: SignOptions = {
  expiresIn: '1h',
  algorithm: 'HS256'
}

export default class AuthToken {
  constructor(private jwtConfig?: SignOptions) {
    if (!jwtConfig) {
      this.jwtConfig = jwtDefaultConfig;
    }
  }

  async generateToken(payload: IUser | IEcoponto) {
    return jwt.sign(payload, SECRET, this.jwtConfig);
  }

  async autenticatorToken(token: string) {
    try {
      const autorization: jwt.JwtPayload = jwt.verify(
        token,
        SECRET,
        this.jwtConfig
      ) as jwt.JwtPayload;
      return autorization as IUser | IEcoponto;
    } catch (error) {
      throw new Error('O token digitado não é valido.')
    }
  }
}