const express = require('express');
require('./db/mongoose');
const { restart } = require('nodemon');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }

// })

// app.use((req, res, next) => {
//     res.status(503).send('Sorry, site is currently undergoing maintenance. Please try again later.')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abc123' }, 'thisisanythingyouwant', { expiresIn: '7 days' })

    const data = jwt.verify(token, 'thisisanythingyouwant')

    console.log(data)
}

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('6123980f6dd50f04c4d4db78')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('612397b805b8613888a4210c')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)


}

// main()


