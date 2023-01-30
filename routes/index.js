import express from 'express';
import users from './users.js';
import rfid from './rfid.js';
import travel from './travel.js';

var router = express.Router();

router.use('/users', users);
router.use('/card', rfid);
router.use('/travel', travel);

export default router;