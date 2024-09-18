import { Router } from "express";
import AuthenticateToken from "../middleware/auntenticateToken";
import UserController from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.post('/users/register', userController.create);
router.post('/user/login', userController.login);
router.get('/users', userController.getAll);

router.get('/user/:id', AuthenticateToken, userController.getById);
router.get('/user/points/:id', AuthenticateToken, userController.getPointsAndQuilosUser);
router.post('/user/:id', AuthenticateToken, userController.updated);
router.delete('/user/:id', AuthenticateToken, userController.remove);

export default router;