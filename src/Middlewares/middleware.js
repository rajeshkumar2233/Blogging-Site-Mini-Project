const jwt = require("jsonwebtoken")
const blogModel = require("../models/blogModel.js")
const authorModel = require("../models/authorModel.js")


const authentication = async function (req,res,next) {
    try {
    let token = req.headers["x-api-key"]
    if(!token) return res.status(401).send({status:false,data:"token is not present for authentication"})
    let decodeToken = jwt.verify(token,"RARS")
    req.decodeToken = decodeToken
    if(!decodeToken) return res.status(403).send({status:false,data:"authentication failed"})
    next()
    } catch (error) {
        res.status(500).send({status:false,data:error.message})
    }
}

const authorisation = async function(req,res,next) {
    let blogId = req.params.blogId
    let authorId = await blogModel.findById(blogId).select({authorId:1,_Id:0})
    let Id = decodeToken.authorId
    if(authorId !== Id) return res.status(403).send({status:false,data:"authorisation failed"})
    next()
}

module.exports.authentication = authentication
module.exports.authorisation = authorisation

