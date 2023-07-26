const Chat = require('../models/Messages')
const user = require('../models/Users')
const converstion = require("../models/Converstion")

const conversations = (async (req, res) => {
  console.log(req.body)
  const { userA } = req.body
  console.log("userA", userA)
  const userB = req.user.userId;
  console.log("userB", userB)
  const uid = await converstion.findOne({}, "userId").sort({ userA: -1 });
  console.log("uid", uid)
  

})




exports.sendMessage = async (req, res) => {
  try {
    const userId = req.body.receiverId;
    const senderId = req.user.userId; // Assuming the authenticated user's ID is available in req.user.userId
    const username = req.user.username;
    // console.log('receiverId', userId);
    console.log('username', username);

    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiveId: receiveId,

    });

    const savedMessage = await chatMessage.save();

    // Emit the message to the recipient's socket
    io.to(receiveId).emit('test-event', { message: req.body.message, senderId });
    // io.to(receiveId).emit('conversations', { message: req.body.message, senderId });
    res.json({
      receiveId: userId,
      status: true,
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
  const { receiveId, userId } = req.params;
  console.log("receiveId", receiveId)
  console.log("userId", userId)
  try {
    const messages = await Chat.find({ receiveId: receiveId, userId: userId });
    console.log("records", records)
    res.json({
      chats: messages,
      msg: "Succes",
      status: true
    })
  } catch (error) {
    console.log(error)
    res.json({
      error: error,
      status: false,
      msg: "Decline Chat"
    })
  }
}
);
