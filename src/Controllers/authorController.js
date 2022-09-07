const authorModel = require("../Models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let { fname, lname, title, email, password } = author

        //----------------------check user input---------------------------------------//
        if (!fname) { return res.status(400).send({ msg: "fname is required" }) }
        if (!lname) { return res.status(400).send({ msg: "lname is required" }) }
        if (!title) { return res.status(400).send({ msg: "title is required" }) }
        if (!email) { return res.status(400).send({ msg: "email is required" }) }
        if (!password) { return res.status(400).send({ msg: "password is required" }) }


        if (typeof fname !== "string" && fname.trim().length === 0)
            return res.status(400).send({ status: false, msg: "please enetr a valid firstname" })

        if (typeof lname !== "string" && fname.trim().length === 0)
            return res.status(400).send({ status: false, msg: "please enetr a valid lastname" })

        if (title !== "Mr" && title !== "Mrs" && title !== "Miss")
            return res.status(400).send({ status: false, msg: "please enter  Mr or Mrs or Miss" })

        let validEmail = function (mail) {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        }
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })



        let findEmail = await authorModel.findOne({ email: email })

        if (findEmail) return res.status(400).send({ msg: "account is already exist with this email id" })

        let checkPassword = function (pass) {
            return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass))
        }
        if (!checkPassword(password))
            return res.status(400).send({ status: false, msg: "password should be Minimum eight characters, at least one letter and one number" })

        let authorCreated = await authorModel.create(author)
        return res.status(201).send(authorCreated)


    } catch (error) {
        console.log("hi ")
        return res.status(500).send({ status: false, msg: error.message })
    }

}


module.exports.createAuthor = createAuthor