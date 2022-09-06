const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/authorModel")

const createBlog = async function (req, res) {
    try {
        const blog = req.body
        let{title,body,authorId,tags,category,subcategory,...rest} = blog
        if(!title){return res.status(400).send({msg:"title is required"})}
        if(!body){return res.status(400).send({msg:"body is required"})}
        if(!authorId){return res.status(400).send({msg:"authorId is required"})}
        if(!tags){return res.status(400).send({msg:"tags is required"})}
        if(!category){return res.status(400).send({msg:"category is required"})}
        if(!subcategory){return res.status(400).send({msg:"subcategory is required"})}
        

        const isAvailable = authorModel.findById(authorId)

        if (!isAvailable) {
            return res.status(404).send({ status: false, msg: "author is in not available...!!" })
        }

        const blogCreated = await blogModel.create(blog)
        // if (!blogCreated) return res.status(400).send({ status: false, msg: "invalid input" })

        res.status(201).send({ status: true, msg: blogCreated })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports.createBlog = createBlog