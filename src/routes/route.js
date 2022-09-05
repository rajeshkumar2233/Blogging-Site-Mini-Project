const express = require("express")
const router = express.Router()
const authorController = require("../Controllers/authorController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.post("/authors", authorController.createAuthor)

module.exports = router