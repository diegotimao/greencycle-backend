import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

const userController = new UserController();

router.get('/users', userController.getAll);
router.get('/user/:id', userController.getById);
router.post('/users/register', userController.create);
router.post('/user/login', userController.login);
router.post('/user/:id', userController.updated);
router.delete('/user/:id', userController.remove);

export default router;