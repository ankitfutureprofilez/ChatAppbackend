const servicesM= require("../models/Services")



exports.services = (async (req, res) => {
    console.log(req.body)
    try {
        const { title, Feature, Desc,keyword } = req.body

        const Result = new servicesM({
            title: title,
            Feature: Feature,
            Desc: Desc,
            keyword:keyword
        })
        console.log("Result", Result)
        const Data = await Result.save();
        res.json({
            data: Data,
            msg: "Success",
            status: 200
        })

    } catch (error) {
        console.log(error);
        res.json({
            error: error,
            Msg: "Services Not Found",
            status: 400
        })
    }



})


