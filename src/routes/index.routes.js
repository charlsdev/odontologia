import { Router } from 'express';
const router = Router();

import {
   renderLogin,
   loginAuth,
   register,
   renderWelcome,
   renderPacientes,
   getAllPacients,
   newFicha,
   searchFicha,
   updateFicha,
   readFicha,

   logout,
} from '../controllers/index.controllers.js';

import { isAuthenticated, isNotAuthenticated } from '../helpers/protection.js';

router.get('/', isNotAuthenticated, renderLogin);
router.post('/', isNotAuthenticated, loginAuth);
router.post('/register', isNotAuthenticated, register);
router.get('/w', isAuthenticated, renderWelcome);
router.get('/pacients', isAuthenticated, renderPacientes);
router.get('/allPacients', isAuthenticated, getAllPacients);
router.post('/newFicha', isAuthenticated, newFicha);
router.get('/searchFicha', isAuthenticated, searchFicha);
router.post('/updateFicha', isAuthenticated, updateFicha);
router.get('/readFicha', isAuthenticated, readFicha);

router.get('/exit', isAuthenticated, logout);

export default router;
