const Chat = require('../models/Messages')
const user = require('../models/Users')
const Conversation = require("../models/Converstion")
const io = require('socket.io')(); // Don't need this since io is initialized in the server file


const { Configuration, OpenAIApi } = require("openai");

const ApiKey = process.env.OPENAI_API_KEY;
console.log("ApiKey",ApiKey)
const configuration = new Configuration({
  apiKey: ApiKey,
});
console.log("configuration",configuration)
const openai = new OpenAIApi(configuration);
console.log("openai",openai)


exports.findAnswer = async (req, res) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-001",
      prompt: "Whats is the capital of india??",
    });

    console.log(completion.data.choices[0].text);
    res.json({
      response: completion.data.choices[0].text,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};



exports.conversion = (async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.body.userB;
    console.log("senderId", senderId)
    console.log("receiverId", receiverId)
    const lastuid = await Conversation.findOne({}, "uid").sort({ uid: -1 });
    const newuid = lastuid ? +lastuid.uid + 1 : 1;

    console.log("newuserID", newuid)

    // Save the conversation in the database

    //console.log("given the  COnversion I'd");


    if (lastuid) {
      console.log("given the converstion id ")
    } else {
      const conver = new Conversation({
        userId: senderId,
        receiverId: receiverId,
        uid: newuid,
      });
      
    }
    const newconversation = await conver.save();
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
    const receiverId = req.body.receiverId;
    const senderId = req.user.userId; // Assuming the authenticated user's ID is available in req.user.userId
    // const username = req.user.username;
    console.log("senderId", senderId)
    console.log("receiverId", receiverId)
    // console.log('username', username);
    // Console.log(username);


    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiveId: receiverId
    });


    // New Coversation ID or updated status

    // check ui exixts or not
    const lastuid = await Conversation.findOne({}, "uid").sort({ uid: -1 });
    const newuid = lastuid ? +lastuid.uid + 1 : 1;

    if (lastuid) {
      console.log("given the converstion id ")
    } else {
      const conver = new Conversation({
        userId: senderId,
        receiverId: receiverId,
        uid: newuid,
      });
      const newconversation = await conver.save();
      console.log("newconversation", newconversation)

    }

    // const conver = new Conversation({
    //   userId: senderId,
    //   receiverId: receiverId,
    //   uid: newuid,
    // });
    // const newconversation = await conver.save();
    // console.log("newconversation", newconversation)



    const savedMessage = await chatMessage.save();


    console.log("savedMessage", savedMessage);

    // Emit the message to the recipient's socket
    io.to(receiverId).emit('test-event', { message: req.body.message, senderId });
    // io.to(receiveId).emit('conversations', { message: req.body.message, senderId });
    res.json({
      receiveId: receiverId,
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
