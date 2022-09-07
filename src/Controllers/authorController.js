const authorModel = require("../Models/authorModel")

const createAuthor = async function(req, res) {
    try {
        let author = req.body
        let { fname, lname, title, email, password } = author
        if (!fname) { return res.status(400).send({ msg: "fname is required" }) }
        if (!lname) { return res.status(400).send({ msg: "lname is required" }) }
        if (!title) { return res.status(400).send({ msg: "title is required" }) }
        if (!email) { return res.status(400).send({ msg: "email is required" }) }
        if (!password) { return res.status(400).send({ msg: "password is required" }) }

        //----------------------check user input---------------------------------------//
        if (!fname) { return res.status(400).send({ msg: "fname is required" }) }
        if (!lname) { return res.status(400).send({ msg: "lname is required" }) }
        if (!title) { return res.status(400).send({ msg: "title is required" }) }
        if (!email) { return res.status(400).send({ msg: "email is required" }) }
        if (!password) { return res.status(400).send({ msg: "password is required" }) }



        if (typeof fname !== "string" && fname.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "please enetr a valid firstname" })
        }
        if (typeof lname !== "string" && fname.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "please enetr a valid lastname" })
        }
        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") {
            return res.status(400).send({ status: false, msg: "please enter  Mr or Mrs or Miss" })
        }


        let findEmail = await authorModel.findOne({ email: email })

        if (findEmail) {
            return res.status(400).send({ msg: "email id already exsits" })
        }
        let validEmail = function(mail) {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        }
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })




        if (findEmail) return res.status(400).send({ data: "account is already exist with this email id" })

        let checkPassword = function(pass) {
            return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass))
        }
        if (!checkPassword(password))
            return res.status(400).send({ status: false, data: "password should be Minimum eight characters, at least one letter and one number" })

        let authorCreated = await authorModel.create(author)
        return res.status(201).send(authorCreated)

    } catch (error) {
        console.log("hi ")
        return res.status(500).send({ status: false, data: error.message })
    }

}

// ###
// POST / login -
//     Allow an author to login with their email and password.On a successful login attempt
// return a JWT token contatining the authorId in response body like[this](#Successful - login - Response - structure) -
//     If the credentials are incorrect
// return a suitable error message with a valid HTTP status code

const login = async function(req, res) {
    try {
        let email = req.body.email
        let pass = req.body.password
        if (!email) return res.status(400).send({ status: false, data: "please Enter email Id" })
        if (!pass) return res.status(400).send({ status: false, data: "please Enter pass" })
        let author = await authorModel.findOne({
            email: email,
            pass: pass
        });
        if (!author) return res.status(401).send({ status: false, msg: "Email or passward are wrong" })

        let token = jwt.sign({
                authorId: author._id.toString()
            },
            "RARS"
        )
        return res.status(200).send({ status: true, data: { token: token } })
    } catch (error) {
        return res.status(500).send({ status: false, data: error.message })
    }
}
module.exports.login = login

module.exports.createAuthor = createAuthor