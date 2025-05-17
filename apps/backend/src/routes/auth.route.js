import {Router} from 'express'


import authController from '../controller/auth.controller.js';


const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/refresh-token', authController.refresh);


export default router;