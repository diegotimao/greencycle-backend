import { Router } from "express";
import TransacaoController from "../controllers/transacao.controller";

const router = Router();
const transacaoController = new TransacaoController();

router.post('/transacao', transacaoController.create);
router.get('/transacao/user/:id', transacaoController.getAllTransacaoUser);
router.get('/transacao/ecoponto/:id', transacaoController.getAllTransacaoEcoponto);
router.post('/transacao/cofirmation', transacaoController.confirmationTransacao);

export default router;