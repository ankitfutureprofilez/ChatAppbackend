const Chat = require('../models/Messages')
const Usermodel = require('../models/Users')

// controllers/chatController.js

exports.Chat = async (req, res) => {
  try {
    const reciverid = req.body.userid;
    const user = req.user.userId;

    console.log('reciverid', reciverid);
    console.log(reciverid, user);

    const messageResult = new Chat({
      message: req.body.message,
      sender: user,
    });

    const messagereq = await messageResult.save();

    // Emit the message to the recipient's socket
   // req.app.get('io').to(reciverid).emit('recive-messgae', { message: req.body.message, sender: user });

    res.json({
      reciverid: reciverid,
      status: 200,
      success: true,
      message: messagereq,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err,
    });
  }
};



exports.chatshow = (
  async (req, res) => {
    try {
      const user = await Usermodel.findOne({}); // Modify the query to fetch the user based on your requirements

      //const UserRecode=  UserId === UserId ? 'right' : 'left';
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
