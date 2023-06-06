const express = require('express')
const router = express.Router()
const { registerUser, verifyUser, createPassword, loginUser } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/verify', verifyUser)
router.post('/createpassword', createPassword)
router.post('/login', loginUser)

module.exports = router