import express from 'express'
import { addCard, counterRegion, getCard } from '../controllers/RFIDController.js'
import jwtAuth from '../middlewares/jwtAuth.js'
import roleAuth from '../middlewares/roleAuth.js'


var router = express.Router()

router.get('/', getCard)
router.post('/', addCard)
router.post('/region', counterRegion)

export default router
