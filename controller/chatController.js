const Chat = require('../models/Messages')
const Usermodel = require('../models/Users')


exports.sendMessage = async (req, res) => {
  try {
    const userId = req.body.receiverId;
    const senderId = req.user.userId; // Assuming the authenticated user's ID is available in req.user.userId

    console.log('receiverId', userId);
    console.log('senderId', senderId);

    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiveId: receiveId,
    });

    const savedMessage = await chatMessage.save();

    // Emit the message to the recipient's socket
    io.to(receiveId).emit('receive-message', { message: req.body.message, senderId });

    res.json({
      receiveId: userId,
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




exports.chatsMessageList = (async (req, res) => {
  const { receiveId } = req.params;
  console.log("receiveId", receiveId)
  try {
    const records = await Chat.find({ receiveId: receiveId });
    console.log("records", records)
    res.json({
      chats: records,
      msg: "Succes",
      status: 200
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
