const Jobs = require('../models/Jobs')



exports.jobs = (async(req, res) => {
    //console.log("req.body", req.body)
    try {
        const { title, salary, experince, keyword ,Desc,Time,Shift,position} = req.body
        const jobs = new Jobs({
            title: title,
            salary: salary,
            experince: experince,
            keyword: keyword,
            Desc:Desc,
            Time:Time,
            Shift:Shift,
            position:position
        })
        const result =await jobs.save()
        res.json({
            data: result,
            status: 200,
            msg: "Success "
        })
    } catch (error) {
       // console.log("error", error);
        res.json({
            error: error,
            msg: "Job Keywords Not Valids",
            status: 400
        })
    }




})
