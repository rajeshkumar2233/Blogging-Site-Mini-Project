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
// delete blog id
router.delete('/blogs/:blogId', blogController.deletebyBlogId)

//update blogg

router.put("/blogs/:blogId", blogController.updateBlog)
router.delete("/blogs", blogController.deleteBlog)
router.get("/getBlogs", blogController.getBlogs)

module.exports = router