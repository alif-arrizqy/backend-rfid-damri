import express from 'express';
import users from './users.js';
import rfid from './rfid.js';

var router = express.Router();

router.use('/users', users);
router.use('/card', rfid);

export default router;