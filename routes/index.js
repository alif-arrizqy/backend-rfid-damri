import express from 'express';
import users from './users.js';
import rfid from './rfid.js';
import travel from './travel.js';
import auth from './auth.js';

var router = express.Router();

router.use('/users', users);
router.use('/card', rfid);
router.use('/travel', travel);
router.use('/auth', auth);

export default router;