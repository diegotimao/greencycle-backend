import { Router } from "express";
import TransacaoController from "../controllers/transacao.controller";

const router = Router();
const transacaoController = new TransacaoController();

router.post('/transacao', transacaoController.create);
router.get('/transacao/:id', transacaoController.getAllTransacaoUser);
router.post('/transacao/cofirmation', transacaoController.confirmationTransacao);

export default router;