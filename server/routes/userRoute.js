const express = require('express')
const router = express.Router();

//* ---------------------------------- IMPORTING CONTROLLERS ----------------------------------
const { signup, sendOTP, login, changePassword } = require('../controllers/authController')
const { resetPasswordToken, resetPassword } = require('../controllers/resetPasswordController')
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/authMiddleware')


//* ---------------------------------- AUTH SECTION -------------------------------------------
router.post('/signup', signup)
router.post('/login', login)
router.post('/sendotp', sendOTP)
router.patch('/changePasword', changePassword)
router.post('/reset-password-token', resetPasswordToken)
router.post('/reset-password', resetPassword)

//* -------------------------- Authorization middlewares --------------------------------------
router.get('/student', auth, isStudent, (req, res) => res.send('Hello Student'))
router.get('/instructor', auth, isInstructor, (req, res) => res.send('Hello Instructor'))
router.get('/admin', auth, isAdmin, (req, res) => res.send('Hello Admin'))

module.exports = router;