const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/authorModel")
const { findById, findByIdAndUpdate } = require("../Models/authorModel")
const moment = require("moment")

const createBlog = async function (req, res) {
    try {
        const blog = req.body
        let { title, body, authorId, tags, category, subcategory, ...rest } = blog
        if (!title) { return res.status(400).send({ msg: "title is required" }) }
        if (!body) { return res.status(400).send({ msg: "body is required" }) }
        if (!authorId) { return res.status(400).send({ msg: "authorId is required" }) }
        if (!tags) { return res.status(400).send({ msg: "tags is required" }) }
        if (!category) { return res.status(400).send({ msg: "category is required" }) }
        if (!subcategory) { return res.status(400).send({ msg: "subcategory is required" }) }


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

const deletebyBlogId = async function (req, res) {
    try {

        let blogId = req.params.blogId
        if (!blogId) {
            return res.status(404).send({ status: false, msg: "blogId not found" });
        }

        let blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, msg: " blog not found" });
        }

        if (blog.isDeleted == false) {
            let save = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() }, }, { new: true });

            return res.status(200).send({ msg: save });


        } else {
            res.status(404).send({ status: false, msg: "already deleted" });
        }

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}






const updateBlog = async function (req, res) {

    try {
        let id = req.params.blogId

        let blog = await blogModel.findById(id)

        //validation 
        if (!blog) return res.status(404).send({ status: false, msg: "blog is not present" })

        //  Check if the blogId exists (must have isDeleted false). If it doesn't, 
        //          return an HTTP status 404 with a response body like [this](#error-response-structure)
        if (blog.isDeleted == true) return res.status(404).send({ status: false, msg: "blog is deleted" })

        let blogData = req.body
        // - Updates a blog by changing the its title, body, adding tags, adding a subcategory.
        //          (Assuming tag and subcategory received in body is need to be added)

        let data = req.body
        let updateBlog = await blogModel.findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                body: data.body,
                publishedAt: new Date(),
                isPublished: true
            },
            $push: {
                tags: data.tags,
                subcategory: data.subcategory
            }
        }, { new: true })

        // - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
        res.status(200).send({ status: true, data: updateBlog })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}



const deleteBlog = async function (req, res) {
    try {
        let data = req.query
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter required filter" })
        }
        let result = { isDeleted: false, ...data }
        let find = await blogModel.find(result)
        if (find.length == 0) return res.status(404).send({ status: false, msg: "collection is not found" })
        let findData = await blogModel.updateMany(result, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        res.status(200).send({ status: true, msg: findData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




const getBlogs = async function (req, res) {
    try {
        // Spreading query to pass all the filters in condition
        // Filter blogs list by applying filters.Query param can have any combination of below filters. -
        //     By author Id -
        //     By category -
        //     List of blogs that have a specific tag -
        //     List of blogs that have a specific subcategory

        const save = req.query
        let findData = { isDeleted: false, isPublished: true, ...save }
        // Returns all blogs in the collection that aren 't deleted and are published -
        const check = await blogModel.find(findData);

        // If no documents are found thenf
        // return an HTTP status 404 with a response like[this](#error - response - structure) -
        if (check.length == 0) return res.status(404).send({ status: false, msg: "No blogs found" })
        // Return the HTTP status 200
        //if any documents are found.The response structure should be like[this](#successful - response - structure) -
        //     If no documents are found then
        return res.status(200).send({ status: true, data: check });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports.getBlogs = getBlogs

module.exports.createBlog = createBlog
module.exports.deletebyBlogId = deletebyBlogId
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog