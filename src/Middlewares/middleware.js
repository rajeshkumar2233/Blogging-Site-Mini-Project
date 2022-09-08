const jwt = require("jsonwebtoken")
const blogModel = require("../Models/blogModel.js")
const mongoose = require("mongoose")



const authentication = async function (req,res,next) {
    try {
    let token = req.headers["x-api-key"]
    if(!token) return res.status(401).send({status:false,data:"token is not present for authentication"})
    let decodeToken = jwt.verify(token,"RARS")
    if(!decodeToken) return res.status(403).send({status:false,data:"authentication failed"})
    req.decodeToken = decodeToken
    next()
    } catch (error) {
        res.status(500).send({status:false,data:error.message})
    }
}

const authorisation = async function(req,res,next) {
    let blogId = req.params.blogId
    if(!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).send({status:false,data:"blog id validation failed"})
    let author = await blogModel.findById(blogId).select({authorId:1,_id:0})
    if(!author) return res.status(404).send({status:false,data:"blog is not found"})
    let Id1 =author.authorId.toString() 
   
    
    let Id = req.decodeToken.authorId
    if(Id1!== Id) return res.status(403).send({status:false,data:"You are not authorised"})
    next()
}

const authorisation1 = async function(req,res,next) {
    let id = req.query.authorId
    if(!id) return res.status(403).send({status:false,data:"authorId is required"})
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({status:false,data:"Please enter valid id"})
    let author_Id = req.decodeToken.authorId
    if(id !== author_Id) return res.status(403).send({status:false,data:"You are not authorised"})
    next()

}

module.exports.authentication = authentication
module.exports.authorisation = authorisation
module.exports.authorisation1 = authorisation1

