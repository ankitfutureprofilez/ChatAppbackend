const Jobs = require('../models/Jobs')



exports.jobs = ((req, res) => {
    console.log("req.body", req.body)
    try {
        const { title, salery, experince, keyword } = req.body
        const jobs = new Jobs({
            title: title,
            salery: salery,
            experince: experince,
            keyword: keyword,
        })
        res.json({
            data: jobs,
            status: 200,
            msg: "Success "
        })
    } catch (error) {
        console.log("error", error);
        res.json({
            error: error,
            msg: "Job Keywords Not Valids",
            status: 400
        })
    }




})
