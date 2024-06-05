import { z, ZodError } from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'E-mail inválido'}),
  cpf: z.string().min(11, { message: 'O cpf deve ter 11 caracteres'}).max(11, { message: 'O cpf deve ter 11 caracteres'}),
  city: z.string(),
  state: z.string(),
  password_hash: z.string().min(6, { message: 'A senha deve ter no minímo 6 caracteres.'}),
});

type UserData = z.infer<typeof userSchema>;

export class User {
  name: string;
  email: string;
  cpf: string;
  city: string;
  state: string;
  password_hash: string;

  constructor(userData: UserData) {
    this.name = userData.name;
    this.email = userData.email;
    this.cpf = userData.cpf;
    this.city = userData.city;
    this.state = userData.state;
    this.password_hash = userData.password_hash;
  };

  static validate(userData: unknown): User {
    const parseData = userSchema.parse(userData);
    return new User(parseData);
  }
}

export { userSchema, ZodError };