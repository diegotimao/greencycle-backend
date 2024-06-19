import { Router } from "express";
import TransacaoController from "../controllers/transacao.controller";

const router = Router();

const transacaoController = new TransacaoController();

router.post('/transacao', transacaoController.create);
router.post('/transacao/cofirmation', transacaoController.confirmationTransacao);

export default router;