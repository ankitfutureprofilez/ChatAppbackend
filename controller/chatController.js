const Chat = require('../models/Messages')
const user = require('../models/Users')
const Conversation = require("../models/Converstion")





exports.conversion = (async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.body.userB;
    console.log("senderId", senderId)
    console.log("receiverId", receiverId)
    const lastuid = await Conversation.findOne({}, "uid").sort({ uid: -1 });
    const newuid = lastuid ? lastuid.uid + 1 : 1;
    console.log("newuserID", newuid)

    // Save the conversation in the database
    const newConversation = new Conversation({
      userA: senderId,
      userB: receiverId,
      uid: newuid,
    });

    const newconversation = await newConversation.save();

    console.log("newconversation", newconversation)
    res.json({
      status: 200,
      data: newconversation,
      msg: "Successfully Created"

    })

  } catch (err) {
    console.log(err)
    res.json({
      err: err,
      msg: "Error Detec",
      status: 400
    })
  }

})






exports.sendMessage = async (req, res) => {
  try {

    const userId = req.body.receiverId;
    const senderId = req.user.userId; // Assuming the authenticated user's ID is available in req.user.userId
    const username = req.user.username;


    // console.log('receiverId', userId);
    //   console.log('username', username);

    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiveId: receiveId,
      username: username
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
  const { receiveId } = req.params;
  //console.log("receiveId", receiveId)

  try {
    const records = await Chat.find({ receiveId: receiveId });
    ///  console.log("records", records)
    res.json({
      chats: records,
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
