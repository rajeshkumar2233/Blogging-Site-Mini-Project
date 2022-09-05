const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/authorModel")

const createBlog = async function (req, res) {
    try {
        const blog = req.body
        let Id = req.body.authorId

        const isAvailable = authorModel.findById(Id)

        if (!isAvailable) {
            return res.status(404).send({ status: false, msg: "author is in not available...!!" })
        }

        const blogCreated = await blogModel.create(blog)
        if (!blogCreated) return res.status(400).send({ status: false, msg: "invalid input" })

        res.status(201).send({ status: true, msg: blogCreated })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports.createBlog = createBlog