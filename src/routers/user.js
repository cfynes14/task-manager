const express = require('express')
const User = require('../models/user')
const auth = require ('../middleware/auth')
const sharp = require('sharp')
const router = new express.Router()
const multer = require('multer')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const { uploadFile, getFileStream, deleteFileStream } = require('../s3/s3')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()


        res.send({  user, token })
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
      }) 
      await req.user.save()

      res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
   try {
    req.user.tokens = []

    await req.user.save()

    res.send()
   } catch (e) {
    res.status(500).send()
   }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png$)/)) {
            return cb(new Error('Please upload files in jpg, jpeg or png format'))
        }

        return cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    console.log('uploading avatar')

    const file = req.file

    const result = await uploadFile(file)

    if (result === undefined) {
        res.status(400).send()
    } else {
        await unlinkFile(file.path)
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatarKey = result.Key
    await req.user.save()
    res.send()
    }
})

router.delete('/users/:id/avatar', auth, async (req, res) => {   
    console.log('deleteing avatar')

    console.log(req.params.id)
    try {
        const user = await User.findById(req.params.id)
    
        if (!user || !user.avatarKey){
            throw new Error()
        }

        const key = user.avatarKey

        try {
            await deleteFileStream(key)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
            return
        }

    req.user.avatarKey = undefined

    await req.user.save()

    res.send()
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    } 
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    console.log('getting user avatar')
    try {
        const user = await User.findById(req.params.id)
        console.log(req.params.id)
        if (!user || !user.avatarKey) {
            throw new Error('No key')
        }
    const key = user.avatarKey
        const readStream = await getFileStream(key)
        console.log('THISIS THE KEY')
        console.log(readStream.key)
        res.set('Content-Type', 'image/png')
        readStream.pipe(res)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


module.exports = router