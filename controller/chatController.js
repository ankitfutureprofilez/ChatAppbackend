const Chat = require('../models/Messages')
const Usermodel = require('../models/Users')


exports.Chat = (async (req, res) => {
    try {
        const reciverid = req.body.uid;
        const user = req.user.id;
        // console.log(reciverid,user)
        let messageResult = new Chat({
            message: req.body.message,
            reciverid: reciverid,
            sender: user
        });

        // console.log("messageResult", messageResult)
        const messagereq = await messageResult.save();
        //  io.emit(`msgSent-${reciverid}`, messagereq);
        res.json({
            loginuser: user,
            status: 200,
            success: true,
            message: messagereq
        });


    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: err
        });
    }
});



exports.chatshow = (
    async (req, res) => {
        try {
            const user = await Usermodel.findOne({}); // Modify the query to fetch the user based on your requirements

            // const UserRecode=  UserId === UserId ? 'right' : 'left';
            const records = await Chat.find({})


            res.json({
                data: records,
                msg: "Succes",
                status: 200,
                UserId: user
            })
        } catch (error) {
            console.log(error)
            res.json({
                error: error,
                status: 400,
                msg: "Decline Chat"
            })
        }
    }
);
