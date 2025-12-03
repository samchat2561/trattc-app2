const express = require('express')
const app = express()
const session = require('express-session');

require('dotenv').config()
const path = require('path')

const PORT = process.env.PORT || 3001

app.set('view engine', 'ejs')
// app.set('views', path.resolve('./views'))

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'))

// Middleware - เวอร์ชั่น Express 4.16.0+ ขึ้นไป 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: false } // true
}))

// Routes
const productRoutes = require('./routes/productRoutes');

app.use('/products', productRoutes);
app.use('/', require('./routes/index'))

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})