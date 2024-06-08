import { Router } from "express";
import EcopontoController from "../controllers/ecoponto.controller";

const router = Router();
const ecopontoController = new EcopontoController();

router.get('/ecopontos', ecopontoController.getAll);
router.get('/ecoponto/:id', ecopontoController.getById);
router.delete('/ecoponto/:id', ecopontoController.remove);
router.post('/ecoponto/register', ecopontoController.create);
router.post('/ecoponto/:id', ecopontoController.update);

export default router;