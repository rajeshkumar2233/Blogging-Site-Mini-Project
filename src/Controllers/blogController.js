const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/authorModel")
const { findById, findByIdAndUpdate } = require("../Models/authorModel")
const moment = require("moment")
const { mongo, default: mongoose } = require("mongoose")

const createBlog = async function (req, res) {
    try {
        const blog = req.body
        let { title, body, authorId, tags, category, subcategory, ...rest } = blog

        //-------------------- check mendatory field-------------------------------------//

        if (!title) return res.status(400).send({ data: "title is required" })
        if (!body) return res.status(400).send({ data: "body is required" })
        if (!authorId) return res.status(400).send({ data: "authorId is required" })
        if (!category) return res.status(400).send({ data: "category is required" })
        if (!mongoose.Types.ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "please enter valid author id " })

        // if(req.body.authorId !== req.decodeToken.authorId) return res.status(400).send({status:false,data:"please enter correct authorId"})

        //------------------check author-----------------------------------------------------// 

        const authorAvailable = await authorModel.findById(authorId)

        if (!authorAvailable) {
            return res.status(404).send({ status: false, data: "author is in not available...!!" })
        }
        if (blog["isPublished"] == true) blog["publishedAt"] = Date.now();


        const blogCreated = await blogModel.create(blog)
        res.status(201).send({ status: true, data: blogCreated })

    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}
const getBlogs = async function (req, res) {
    try {

        const save = req.query
        let author_id = req.query.authorId
        if (author_id) {
            if (!mongoose.Types.ObjectId.isValid(author_id)) return res.status(400).send({ status: false, msg: "please enter valid author id " })
        }

        let findData = { isDeleted: false, isPublished: true, ...save }

        const blog = await blogModel.find(findData);

        if (blog.length == 0) return res.status(404).send({ status: false, data: "No blogs found" })

        return res.status(200).send({ status: true, data: blog });
    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}



const updateBlog = async function (req, res) {

    try {
        let id = req.params.blogId
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, data: "blog id validation failed" })

        if (!id) return res.status(404).send({ status: false, data: "blogId is not present" })

        let blog = await blogModel.findById(id)

        if (!blog) return res.status(404).send({ status: false, data: "blog is not present" })

        if (blog.isDeleted == true) return res.status(404).send({ status: false, msg: "blog is already deleted" })

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(404).send({status: false, msg: "Please include atleast one properties to be updated"})

        let updateBlog = await blogModel.findByIdAndUpdate(id, {
            $set: { title: data.title, body: data.body, publishedAt: Date.now(), isPublished: true },
            $push: { tags: data.tags, subcategory: data.subcategory }
        }, { new: true })

        res.status(200).send({ status: true, data: updateBlog })
    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }

}

const deletebyBlogId = async function (req, res) {
    try {

        let blogId = req.params.blogId

        let blog = await blogModel.findById(blogId);
        if (!blog) return res.status(404).send({ status: false, data: " blog not found" });

        if (blog.isDeleted == false) {
            await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
            return res.status(200).send({ msg: "the blog is successfully deleted" });
        } else {
            res.status(404).send({ status: false, data: "already deleted" });
        }

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

let deleteByQuery = async function (req, res) {
    try {

        let data = req.query
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Enter the required filter for deletion" })
        if (data.authorId) {
            if (!mongoose.Types.ObjectId.isValid(data.authorId)) return res.status(400).send({ status: false, msg: "please enter valid author id " })
            if (req.decodeToken.authorId != data.authorId) {
                return res.status(401).send({ status: false, msg: "you are not authorised to delete" })
            } else {
                let blogData = await blogModel.find({ isDeleted: false, ...data })
                if (blogData.length == 0) {
                    return res.status(404).send({ status: false, data: "No blogs found for deletion"})
                } else {
                    await blogModel.updateMany({ isDeleted: false, ...data }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
                    return res.status(200).send({ msg: "the blog is successfully deleted" });
                }
            }
        }
        if (!data.authorid) {
            let blogData = await blogModel.find(data)
            if (blogData.length == 0) return res.status(404).send({ status: false, data: "No blogs found" })
            let result = []
            for (i = 0; i < blogData.length; i++) {
                if (req.decodeToken.authorId === blogData[i].authorId._id.toString()) {
                    result.push(blogData[i])
                }
            }
            if (result.length == 0) {
                return res.status(401).send({ msg: "you are not authorised to delete" });
            } else {
                let finalData = await blogModel.find({ authorId: req.decodeToken.authorId, isDeleted: false, ...data })
                if (finalData.length == 0) {
                    return res.status(200).send({ status: false, msg: "The blogs are already deleted" })
                } else {
                    await blogModel.updateMany({ authorId: req.decodeToken.authorId, isDeleted: false, ...data }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
                    return res.status(200).send({ msg: "the blog is successfully deleted" });
                }
            }
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deletebyBlogId = deletebyBlogId
module.exports.deleteByQuery = deleteByQuery