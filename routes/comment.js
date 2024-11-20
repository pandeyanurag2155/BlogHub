const {Router} = require('express');
const Comment = require('../models/comment')

const router = Router();

router.post('/:blogId', async(req, res) => {
    await Comment.create({
        content: req.body.content,
        postedBy: req.user._id,
        blogId: req.params.blogId
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router