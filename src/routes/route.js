const express = require("express")
const router = express.Router()
const authorController = require("../Controllers/authorController")
const blogController = require("../Controllers/blogController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


//create author
router.post("/authors", authorController.createAuthor)

//create blog
router.post("/blogs", blogController.createBlog)
<<<<<<< HEAD
// delete blog id
router.delete('/blogs/:blogId',blogController.deletebyBlogId)
=======

//update blogg

router.put("/blogs/:blogId", blogController.updateBlog)


>>>>>>> cf937084a62968c9446d2d1bf5429fef8701ebf6
module.exports = router