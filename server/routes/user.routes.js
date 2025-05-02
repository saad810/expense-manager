import * as controller from '../controllers/users.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.post('/login', controller.loginUser);
router.put('/:id', controller.updateUser);

export default router;
