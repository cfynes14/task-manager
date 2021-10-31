const express = require('express');
require('./db/mongoose');
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors') 

const app = express()
 
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app