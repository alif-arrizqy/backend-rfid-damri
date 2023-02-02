import express from 'express';
import { login, checkEmail} from '../controllers/AuthController.js';

var router = express.Router();

router.post('/login', login);
router.post('/check-email', checkEmail);

export default router;
