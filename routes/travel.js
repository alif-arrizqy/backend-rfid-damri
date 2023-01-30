import express from 'express'
import { travelDeparture, travelDestination} from '../controllers/TravelController.js'

var router = express.Router()

router.post('/departure', travelDeparture)
router.post('/destination', travelDestination)

export default router