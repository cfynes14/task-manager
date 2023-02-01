const express = require('express');
require('./db/mongoose');
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors') 

const app = express()
 
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_ENDPOINT); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Cache-Control", "s-max-age=1, stale-while-revalidate")
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    next();
  });


app.options('*', cors())

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app