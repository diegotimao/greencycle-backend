import { z, ZodError } from 'zod';
import { cnpj } from 'cpf-cnpj-validator';

const ecopontoSchema = z.object({
  name: z.string(),
  cnpj: z.string().refine(cnpj.isValid, { message: 'CNPJ inválido.'}),
  email: z.string().email({ message: 'Email inválido.'}),
  city: z.string(),
  houseNumber: z.number(),
  neighborhood: z.string(),
  phone: z.string().min(10, { message: 'O número de telefone deve ter no mínimo 10 digitos'})
    .max(15, { message: 'O número de telefone deve ter no máximo 15 digitos'})
    .regex(/^[0-9]+$/, { message: "O número de telefone deve conter apenas dígitos" }),
  road: z.string(),
  state: z.string(),
  password_hash: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres'}),
});

type EcopontoData = z.infer<typeof ecopontoSchema>;

export class Ecoponto {
  name: string;
  cnpj: string;
  email: string;
  city: string;
  houseNumber: number;
  neighborhood: string;
  phone: string;
  road: string;
  state: string;
  password_hash: string;

  constructor(ecopontoData: EcopontoData) {
    this.name = ecopontoData.name;
    this.cnpj = ecopontoData.cnpj;
    this.city = ecopontoData.city;
    this.email = ecopontoData.email;
    this.houseNumber = ecopontoData.houseNumber;
    this.neighborhood = ecopontoData.neighborhood;
    this.phone = ecopontoData.phone;
    this.road = ecopontoData.road;
    this.state = ecopontoData.state;
    this.password_hash = ecopontoData.password_hash;
  };

  static validate(ecopontoData: unknown): Ecoponto {
    const parseData = ecopontoSchema.parse(ecopontoData);
    return new Ecoponto(parseData);
  };
};

export { ecopontoSchema, ZodError };