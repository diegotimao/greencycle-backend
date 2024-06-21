import { Router } from "express";
import AuttenticateToken from "../middleware/auntenticateToken";
import UserController from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.post('/users/register', userController.create);
router.post('/user/login', userController.login);

router.get('/users', userController.getAll);
router.get('/user/:id', userController.getById);
router.get('/user/points/:id', userController.getPointsAndQuilosUser);
router.post('/user/:id', AuttenticateToken, userController.updated);
router.delete('/user/:id', AuttenticateToken, userController.remove);

export default router;