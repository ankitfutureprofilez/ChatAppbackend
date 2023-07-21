const Chat = require('../models/Messages')
const Usermodel = require('../models/Users')

// controllers/chatController.js

// chatController.js

// Assuming the correct path to your Messages model

// chatController.js

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.body.receiverId;
    const senderId = req.user.userId; // Assuming the authenticated user's ID is available in req.user.userId

    console.log('receiverId', userId);
    console.log('senderId', senderId);

    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
    });

    const savedMessage = await chatMessage.save();

    // Emit the message to the recipient's socket
    io.to(receiverId).emit('receive-message', { message: req.body.message, senderId });

    res.json({
      receiverId: userId,
      status: 200,
      success: true,
      message: savedMessage,
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
    console.log(req.params.userId)
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
