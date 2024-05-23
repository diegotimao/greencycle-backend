import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

const userController = new UserController();

router.get('/users', userController.getAll);
router.post('/user/register', userController.create);

export default router;