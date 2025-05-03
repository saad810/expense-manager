import * as controller from '../controllers/users.controller.js';
import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', controller.getAllUsers);
router.get('/status',auth, controller.getUserStatus);
router.post('/', controller.createUser);
router.post('/login', controller.loginUser);
router.put('/', auth, controller.updateUser);
// router.put('/:id', controller.updateUser);

export default router;
