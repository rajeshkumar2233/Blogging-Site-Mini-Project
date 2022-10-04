const authorModel = require("../Models/authorModel")
const jwt = require("jsonwebtoken")


//====================================================================================================================
const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let { fname, lname, title, email, password } = author

        //----------------------check user input---------------------------------------//
        if (!fname) { return res.status(400).send({ data: "fname is required" }) }
        if (!lname) { return res.status(400).send({ data: "lname is required" }) }
        if (!title) { return res.status(400).send({ data: "title is required" }) }
        if (!email) { return res.status(400).send({ data: "email is required" }) }
        if (!password) { return res.status(400).send({ data: "password is required" }) }

        //-------------------------------Name validation-------------------------------------//

        const validName = function (value)  {
            return (/^(?![\. ])[a-zA-Z\. ]+(?<! )$/.test(value))
        }
        if (!validName(fname)) return res.status(400).send({ status: false, data: "please enter a valid firstname" })
        if (!validName(lname)) return res.status(400).send({ status: false, data: "please enter a valid lastname" })

        //---------------------------------Title validation------------------------------------//

        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") return res.status(400).send({ status: false, data: "title should be Mr or Mrs or Miss" })

        //-----------------------------------Email validation--------------------------------//

        let validEmail = function(mail) {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        }
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })

        let findEmail = await authorModel.findOne({ email: email })
        if (findEmail) return res.status(400).send({ data: "account is already exist with this email id" })

        //-----------------------------------Password validation--------------------------------//

        let checkPassword = function (pass) {
            return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass))
        }
        if (!checkPassword(password))
            return res.status(400).send({ status: false, data: "Minimum eight characters, at least one uppercase & one lowercase letter, one number and one special character: " })

        let authorCreated = await authorModel.create(author)
        return res.status(201).send({status:true,msg:"Author created successfully" ,data:authorCreated})

    } catch (error) {
        return res.status(500).send({ status: false,data: error.message })
    }

}

//=================================================================================================================
const login = async function (req, res) {
    try {
        let email = req.body.email
        let pass = req.body.password
        if (!email) return res.status(400).send({ status: false, data: "please Enter email Id" })
        if (!pass) return res.status(400).send({ status: false, data: "please Enter password" })
        let author = await authorModel.findOne({
            email: email,
            password: pass
        });
        if (!author) return res.status(401).send({ status: false, data: "Email or passward are wrong" })

        let token = jwt.sign({
            authorId: author._id.toString()
        },
            "RARS"
        )
        return res.status(200).send({ status: true,msg:"login successfully", data: token })
    } catch (error) {
        return res.status(500).send({ status: false, data: error.message })
    }
}
module.exports.login = login

module.exports.createAuthor = createAuthor