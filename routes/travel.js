import express from 'express'
import { travelDeparture, travelDestination, getAllTravelHistory, getTravelHistoryByCardId } from '../controllers/TravelController.js'
import jwtAuth from '../middlewares/jwtAuth.js'
import roleAuth from '../middlewares/roleAuth.js'

var router = express.Router()

router.get('/travel-history', [jwtAuth(), roleAuth(['user'])], getAllTravelHistory)
router.get('/travel-history/:cardId', [jwtAuth(), roleAuth(['user'])], getTravelHistoryByCardId)

router.post('/departure', [jwtAuth(), roleAuth(['user'])], travelDeparture)
router.post('/destination', [jwtAuth(), roleAuth(['user'])], travelDestination)

export default router