export interface ITransacao {
  id?: number;
  id_user: number;
  id_ecoponto: number;
  txid: string;
  status_payments: string;
  total_price: number;
  items: Array<{
    material: string;
    quilogramas: number;
    price: number;
  }>;
  data_transacao: string,
  data_aprovacao: string
}

export interface IConfirmationTransacao {
  endToEndId: string,
  txid: string,
  chave: string,
  valor: number,
  horario: string,
}