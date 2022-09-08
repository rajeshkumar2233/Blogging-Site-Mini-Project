const express = require("express")
const router = express.Router()
const authorController = require("../Controllers/authorController")
const blogController = require("../Controllers/blogController")
const mw = require("../Middlewares/middleware")

router.get("/test-me", function(req, res) {
    res.send("My first ever api!")
})



router.post("/authors", authorController.createAuthor)
router.post("/blogs",mw.authentication, blogController.createBlog)
router.get("/getBlogs",mw.authentication, blogController.getBlogs)
router.put("/blogs/:blogId",mw.authentication,mw.authorisation, blogController.updateBlog)
router.delete('/blogs/:blogId',mw.authentication,mw.authorisation, blogController.deletebyBlogId)
router.delete("/blogs",mw.authentication,mw.authorisation1, blogController.deleteBlog)
router.post("/login", authorController.login)


module.exports = router