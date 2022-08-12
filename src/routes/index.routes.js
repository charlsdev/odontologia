import { Router } from 'express';

import {
   getAllPacients,
   loginAuth,
   logout,
   newHistory,
   register,
   renderLogin,
   renderPacientes,
   renderWelcome,
} from '../controllers/index.controllers.js';

import { isAuthenticated, isNotAuthenticated } from '../helpers/protection.js';

const router = Router();

router.get('/', isNotAuthenticated, renderLogin);
router.post('/', isNotAuthenticated, loginAuth);
router.post('/register', isNotAuthenticated, register);
router.get('/w', isAuthenticated, renderWelcome);
router.get('/pacients', isAuthenticated, renderPacientes);
router.get('/allPacients', isAuthenticated, getAllPacients);
router.post('/newHistory', isAuthenticated, newHistory);

router.get('/exit', isAuthenticated, logout);

export default router;
