require('dotenv').config

const { Router } = require('express');
const User = require('../models/user')

const multer = require('multer')
const cloudinary = require('cloudinary').v2

const path = require('path')

const router = Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

var image = "./public/images/default.avif"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/profiles'))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        image = `public/profiles/${fileName}`
        cb(null, fileName)
    }
})



const upload = multer({ storage: storage })

router.get('/signin', (req, res) => {
    return res.render('signin');
})

router.get('/signup', (req, res) => {
    return res.render('signup');
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password)
        return res.cookie('token', token).redirect('/')
    } catch (error) {
        return res.render('signin', {
            error: "incorrect Email or password",
        })
    }
})

router.post('/signup', upload.single('profileImage'), async (req, res) => {
    const { fullName, email, password } = req.body
    const result = await cloudinary.uploader.upload(image)
    const IMAGEURL = result.url;
    
    await User.create({
        fullName,
        email,
        password,
        profileImageURL: IMAGEURL
    })
    return res.render('signin')
})

router.get('/logout', (req, res) => {
    return res.clearCookie('token').redirect('/')
})


module.exports = router
