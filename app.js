require("dotenv").config()

const path = require("path")
const express = require('express')
const mongoose = require('mongoose')

const cookieParser = require("cookie-parser")
const { checkForAuthenticationCookie } = require("./middlewares/authentication")

const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const commentRoute = require('./routes/comment')

const blog = require('./models/blog')

const app = express()
const PORT = process.env.PORT || 8000;

mongoose
    .connect(process.env.MONGO_URL)
    .then(e => console.log("MongoDB connected"))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get('/', async(req, res) => {
    const allBlog =await blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlog,
    })
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.use('/blog/comment/', commentRoute)

app.listen(PORT, () => console.log(`server started ar PORT: ${PORT}`))