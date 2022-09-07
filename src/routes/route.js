const express = require("express")
const router = express.Router()
const authorController = require("../Controllers/authorController")
const blogController = require("../Controllers/blogController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})



router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/getBlogs", blogController.getBlogs)
router.put("/blogs/:blogId", blogController.updateBlog)
router.delete('/blogs/:blogId', blogController.deletebyBlogId)
router.delete("/blogs", blogController.deleteBlog)


module.exports = router