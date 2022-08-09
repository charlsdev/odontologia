import { Router } from 'express';

import { 
   login, 
   register 
} from '../controllers/index.controllers.js';

const router = Router();

router.get('/', login);
router.post('/register', register);

export default router;
