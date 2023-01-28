import express from 'express'
import { getAllUser, addUser, updateUser, showUser, deleteUser } from '../controllers/UserController.js'

var router = express.Router()

router.get('/', getAllUser)
router.post('/', addUser)
router.put('/:id', updateUser)
router.get('/:id', showUser)
router.delete('/:id', deleteUser)

export default router
