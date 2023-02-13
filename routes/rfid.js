import express from 'express'
import { addCard, counterRegion } from '../controllers/RFIDController.js'
import jwtAuth from '../middlewares/jwtAuth.js'
import roleAuth from '../middlewares/roleAuth.js'


var router = express.Router()

router.post('/', addCard)
router.post('/region', counterRegion)

export default router
