const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/authorModel")
const { findById, findByIdAndUpdate } = require("../Models/authorModel")
const moment = require("moment")

const createBlog = async function(req, res) {
    try {
        const blog = req.body
        let { title, body, authorId, tags, category, subcategory, ...rest } = blog

        //-------------------- check mendatory field-------------------------------------//

        if (!title) return res.status(400).send({ data: "title is required" })
        if (!body) return res.status(400).send({ data: "body is required" })
        if (!authorId) return res.status(400).send({ data: "authorId is required" })
        if (!category) return res.status(400).send({ data: "category is required" })

        //-------------------- handle edge cases-----------------------------------------------//

        // if (title.trim().length === 0) return res.status(400).send({ status: false, msg: "please write the title name " })
        // if (body.trim().length === 0) return res.status(400).send({ status: false, msg: "please write the body name " })
        // if( typeof tags !== Array ) return res.status(400).send({ status: false, msg: "Tags should be inside of array" })
        // if( typeof category !== Array ) return res.status(400).send({ status: false, msg: "category should be inside of array" })
        // if( typeof subcategory !== Array ) return res.status(400).send({ status: false, msg: "subcategory should be inside of array" })

        if(req.body.authorId !== req.decodeToken.authorId) return res.status(400).send({status:false,data:"please enter correct authorId"})

        //------------------check author-----------------------------------------------------// 

        const authorAvailable = authorModel.findById(authorId)
        if (!authorAvailable) {
            return res.status(404).send({ status: false, data: "author is in not available...!!" })
        }

        const blogCreated = await blogModel.create(blog)
        res.status(201).send({ status: true, data: blogCreated })

    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }

}

const getBlogs = async function(req, res) {
    try {

        const save = req.query
        let Id = req.decodeToken
        
        let findData = { isDeleted: false, isPublished: true,Id, ...save }

        const blog = await blogModel.find(findData);

        if (blog.length == 0) return res.status(404).send({ status: false, data: "No blogs found" })

        return res.status(200).send({ status: true, data: blog });
    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}



const updateBlog = async function(req, res) {

    try {
        let id = req.params.blogId

        if (!id) return res.status(404).send({ status: false, data: "blogId is not present" });

        let blog = await blogModel.findById(id)

        if (!blog) return res.status(404).send({ status: false, data: "blog is not present" })

        if (blog.isDeleted == true) return res.status(404).send({ status: false, msg: "blog is deleted" })

        let data = req.body

        let updateBlog = await blogModel.findByIdAndUpdate(id, {
            $set: { title: data.title, body: data.body, publishedAt: Date.now(), isPublished: true },
            $push: { tags: data.tags, subcategory: data.subcategory }
        }, { new: true })

        res.status(200).send({ status: true, data: updateBlog })
    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }

}

const deletebyBlogId = async function(req, res) {
    try {

        let blogId = req.params.blogId
            // if (!blogId) {
            //     return res.status(404).send({ status: false, msg: "blogId not found" });
            // }

        let blog = await blogModel.findById(blogId);
        if (!blog) return res.status(404).send({ status: false, data: " blog not found" });

        if (blog.isDeleted == false) {
            await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
            return res.status(200).send({ msg: "the account is successfully deleted" });
        } else {
            res.status(404).send({ status: false, data: "already deleted" });
        }

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


const deleteBlog = async function(req, res) {
    try {
        let data = req.query
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, data: "please enter required filter" })
        let result = { isDeleted: false, ...data }
        let find = await blogModel.find(result)
        if (find.length == 0) return res.status(404).send({ status: false, data: "collection is not found" })
        await blogModel.updateMany(result, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        res.status(200).send({ status: true, data: "sucessfully updated" })
    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}




module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deletebyBlogId = deletebyBlogId
module.exports.deleteBlog = deleteBlog