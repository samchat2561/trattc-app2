const express = require('express')
const router = express.Router()
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/authMiddleware')
const authController = require('../controllers/authController')

const db = require('../config/db')

//http://localhost:3000/
router.get('/', (req, res) => {
    // console.log(req.session.user)
    return res.render('index')
})

//http://localhost:3000/vision
router.get('/vision', (req, res) => {
    return res.render('vision')
})

router.get('/users', authenticate, async (req, res) => {
    await db.query('SELECT * FROM users')
        .then(([result]) => {
            return res.status(200).json(result)
        }).catch((err) => {
            console.log('Error fetching data')
        })
})

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

router.get('/register', authController.getRegister)
router.post('/register', authController.postRegister)

router.get('/logout', authController.getLogout)

router.get('/dashboard', authenticate, (req, res) => {
    const isLoggedIn = req.session.user
    console.log(isLoggedIn)
    res.render('dashboard/index', { isLoggedIn })
})

router.get('/test', authenticate, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' })
});

module.exports = router