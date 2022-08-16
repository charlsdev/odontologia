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
   agendarCita,
   renderCitas,
   getAllCitas,
   searchCita,
   updateCita,
   generateFichaPDF,
   viewPDF,
   renderProfile,
   updateProfile,
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
router.post('/agendarCita', isAuthenticated, agendarCita);
router.get('/citas', isAuthenticated, renderCitas);
router.get('/allCitas', isAuthenticated, getAllCitas);
router.get('/searchCita', isAuthenticated, searchCita);
router.post('/updateCita', isAuthenticated, updateCita);
router.get('/generateFichaPDF', isAuthenticated, generateFichaPDF);
router.get('/pdf/:file', isAuthenticated, viewPDF);
router.get('/profile', isAuthenticated, renderProfile);
router.put('/update', isAuthenticated, updateProfile);
router.get('/exit', isAuthenticated, logout);

export default router;
