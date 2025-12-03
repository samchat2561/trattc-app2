const jwt = require('jsonwebtoken')
require('dotenv').config()

// Middleware to check JWT token
exports.authenticate = (req, res, next) => {
    const token = req.session.token
    if (!token) {
        // return res.status(401).json({ error: 'Access denied' })
        return res.status(401).redirect('/login')
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        // console.log(req.user)
        next()
    } catch (error) {
        return res.status(401).redirect('/login')
    }
}