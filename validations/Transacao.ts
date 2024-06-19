import { z, ZodError } from 'zod';
import { User } from './User';

const itemSchema = z.object({
  material: z.string(),
  quilogramas: z.number().positive(),
  price: z.number().positive(),
});

const transacaoSchema = z.object({
  id_user: z.number(),
  id_ecoponto: z.number(),
  txid: z.string()
    .min(26, { message: "O txid é o id da transação e o minimo de caracteres que ele espera é 26"})
    .max(35, { message: "O txid é o id da transação e o maximo de caracteres que ele espera é 35"}),
  status_payments: z.string({ message: "O campo status do pagamento deve ser uma srtring"}),
  items: z.array((itemSchema)),
  total_price: z.number().positive(),
});

type TransacaoData = z.infer<typeof transacaoSchema>;

export class Transacao {
  id_user: number;
  id_ecoponto: number;
  txid: string;
  status_payments: string;
  items: Array<{ material: string; quilogramas: number; price: number }>;
  total_price: number;

  constructor(transacao: TransacaoData) {
    this.id_user = transacao.id_user;
    this.id_ecoponto = transacao.id_ecoponto;
    this.txid = transacao.txid;
    this.status_payments = transacao.status_payments;
    this.items = transacao.items;
    this.total_price = transacao.total_price;
  };

  static validate(transacaoData: unknown): Transacao {
    const parseData = transacaoSchema.parse(transacaoData);
    return new Transacao(parseData);
  };
};

export { TransacaoData, ZodError }