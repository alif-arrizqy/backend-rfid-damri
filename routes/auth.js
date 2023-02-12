import express from 'express';
import { login, checkEmail, refreshAccessToken} from '../controllers/AuthController.js';

var router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/check-email', checkEmail);

export default router;
