const Company = require("../models/Company")


exports.CompanyDetilas = (async (req, res) => {

    console.log("req.body", req.body)
    try {

        const { name, website, email, Desc, owner, Keyword, year, number } = req.body

        const Result = new Company({
            name: name,
            website: website,
            email: email,
            Desc: Desc,
            owner: owner,
            Keyword: Keyword,
            year: year,
            number: number
        })
        console.log("Result", Result)
        const Data = await Result.save();
        res.json({
            data: Data,
            status: 200,
            msg: "Success "
        })

    } catch (error) {
        console.log(error)
        res.json({
            error: error,
            msg: "Job Keywords Not Valids",
            status: 400
        })
    }

})