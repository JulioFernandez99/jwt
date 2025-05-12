const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const app = express()
const  jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret = process.env.JWT_SECRET

const routesLogin = require('./routes/login.routes')



app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser())

app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = {user: null}

    try {
        data = jwt.verify(token, jwt_secret)    
        req.session.user = data
    } catch  {
        
    }

    next()
})


app.get('/',(req,res)=>{
    res.status(200).json(
        {
            status: true,
            message: 'API de prueba JWT'
        }
    )
})

app.use('/login', routesLogin)

module.exports = app