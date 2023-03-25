import express from 'express'
import { travelDeparture, travelDestination, getAllTravelHistory, getTravelHistoryByCardId, getTravelRealtime } from '../controllers/TravelController.js'
import jwtAuth from '../middlewares/jwtAuth.js'
import roleAuth from '../middlewares/roleAuth.js'

var router = express.Router()

router.get('/travel-history', [jwtAuth(), roleAuth(['admin'])], getAllTravelHistory)
router.get('/travel-history/:cardId', [jwtAuth(), roleAuth(['user'])], getTravelHistoryByCardId)
router.get('/travel-realtime/:cardId', [jwtAuth(), roleAuth(['user'])], getTravelRealtime)

router.post('/departure', travelDeparture)
router.post('/destination', travelDestination)

export default router