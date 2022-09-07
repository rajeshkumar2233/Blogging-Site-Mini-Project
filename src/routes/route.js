const express = require("express")
const router = express.Router()
const authorController = require("../Controllers/authorController")
const blogController = require("../Controllers/blogController")
const middleware = require("../Middlewares/middleware")

router.get("/test-me", function(req, res) {
    res.send("My first ever api!")
})



router.post("/authors", authorController.createAuthor)
router.post("/blogs",middleware.authentication, blogController.createBlog)
router.get("/getBlogs",middleware.authentication, blogController.getBlogs)
router.put("/blogs/:blogId",middleware.authentication,middleware.authorisation, blogController.updateBlog)
router.delete('/blogs/:blogId',middleware.authentication,middleware.authorisation, blogController.deletebyBlogId)
router.delete("/blogs", blogController.deleteBlog)
router.get("/login", authorController.login)


module.exports = router