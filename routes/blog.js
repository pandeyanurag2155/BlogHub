require('dotenv').config

const { Router } = require('express');
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const path = require('path')
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

var image;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        image = (`public/uploads/${fileName}`)
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render("addBlog", {
        user: req.user
    })
})

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body
    const result = await cloudinary.uploader.upload(image)
    const IMAGEURL = result.url

    if(IMAGEURL){

        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL: `${IMAGEURL}`
        })

        return res.redirect(`/blog/${blog._id}`)
    }

    return res.redirect(`/`)
})

router.get('/:id', async (req, res) => {
    // populate merge userData to the blog data where createBy = userId

    const blog = await Blog.findById(req.params.id).populate("createdBy")
    const comments = await Comment.find({ blogId: req.params.id }).populate("postedBy")
    return res.render("blog", {
        user: req.user,
        blog,
        comments
    })
})

module.exports = router