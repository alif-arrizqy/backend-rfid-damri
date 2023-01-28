import express from 'express'
import { addCard, counterRegion } from '../controllers/RFIDController.js'

var router = express.Router()

router.post('/', addCard)
router.post('/region', counterRegion)

export default router
