const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const db = require('../config/db')

exports.getLogin = (req, res) => {
    return res.render('auth/login')
}

exports.postLogin = async (req, res) => {
    const { email, password } = req.body
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email])
    if (!rows[0]) {
        return res.send('Invalid email or password given')
    }
    const isPasswordMatching = await bcrypt.compare(password, rows[0].password)
    if (!isPasswordMatching) {
        return res.status(401).send("Invalid email or password given")
    }
    const userId = rows[0].id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIME_EXPIRES });
    req.session.user = { id: rows[0].id, first_name: rows[0].first_name, last_name: rows[0].last_name, email: rows[0].email, token };
    req.session.token = token
    console.log(req.session.token)
    return res.redirect('/dashboard');
}

exports.getRegister = (req, res) => {
    res.render('auth/register')
}

exports.postRegister = async (req, res) => {
    // res.send(req.body)
    const { title, first_name, last_name, email, password, address } = req.body

    // 1.Check email exists ? if Yes --- Stop 
    db.query("SELECT * FROM users WHERE email=?", [email])
        .then(([result]) => {
            if (result[0]) {
                return res.redirect("/register")
            }
        }).catch((err) => {
            console.log(err)
        })
    // db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    //     if (result) {
    //         console.log("From Register")
    //         console.log(result[0])
    //          return res.redirect("/register")
    //     } else {
    //         console.log(err)
    //     }
    // })

    //2.Hash password
    const hashRounds = 10
    bcrypt.genSalt(hashRounds, (err, salt) => {
        if (err) {
            return res.send('Unable to generate Salt')
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.send('Unable to create Hash')
            }
            //3.Create User in database
            db.query("INSERT INTO users(title, first_name, last_name, role, email, password, address)" +
                "VALUES ('" + title + "','" + first_name + "','" + last_name + "','User','" + email + "','" + hash + "','" + address + "')"
            ).then((result) => {
                console.log("From Register")
                return res.redirect("/login")
            }).catch((err) => {
                if (!res.headersSent) {
                    return res.send(err)
                }
            });

            // db.query("INSERT INTO users(title, first_name, last_name, role, email, password, address)" +
            //     "VALUES ('" + title + "','" + first_name + "','" + last_name + "','User','" + email + "','" + hash + "','" + address + "')", (err, res) => {
            //         if (!res.headersSent) {
            //             return res.send(err)
            //         } else {
            //             console.log("From Register")
            //             return res.redirect("/login")
            //         }
            //     })
        });
    });
}

exports.getLogout = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}
