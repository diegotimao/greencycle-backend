import { Router } from "express";
import TransacaoController from "../controllers/transacao.controller";
import AutenticateToken from "../middleware/auntenticateToken";

const router = Router();
const transacaoController = new TransacaoController();

router.post('/transacao', transacaoController.create); // cria uma transação, apenas o ecoponto deve ter autorização
router.get('/transacao/user/:id', AutenticateToken, transacaoController.getAllTransacaoUser); // busca todas as transações de um usuario, só ele deve ter acesso a esta rota
router.get('/transacao/ecoponto/:id', AutenticateToken, transacaoController.getAllTransacaoEcoponto); // retorna todas as transações de um ecoponto, só o ecoponnto deve ter acesso
router.post('/transacao/cofirmation', transacaoController.confirmationTransacao); // rota de confirmação da transação: Provalmente vai mudar com a implementação da API

export default router;