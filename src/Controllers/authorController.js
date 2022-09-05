const AuthorModel = require("../Models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let authorCreated = await AuthorModel.create(author)
        res.status(201).send(authorCreated)

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports.createAuthor = createAuthor