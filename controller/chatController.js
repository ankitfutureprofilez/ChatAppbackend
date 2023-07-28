const Chat = require('../models/Messages')
const user = require('../models/Users')
const Conversation = require("../models/Converstion")
const io = require('socket.io')(); // Don't need this since io is initialized in the server file


const { Configuration, OpenAIApi } = require("openai");

const ApiKey = process.env.OPENAI_API_KEY;
console.log("ApiKey", ApiKey)
const configuration = new Configuration({
  apiKey: ApiKey,
});
console.log("configuration", configuration)
const openai = new OpenAIApi(configuration);
console.log("openai", openai)


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

    // Process the question and get the answer
    const question = "What is the capital of India?";
    const answerCompletion = await openai.createCompletion({
      model: "text-davinci-001",
      prompt: question,
    });
    const answer = answerCompletion.data.choices[0].text;

    // Save the question and answer to the database
    const chatMessage = new Chat({
      message: question,
      userId: senderId,
      receiveId: receiverId,
      answer: answer,
    });
    const savedMessage = await chatMessage.save();

    // Create or update the conversation ID
    const lastUid = await Conversation.findOne({}, "uid").sort({ uid: -1 });
    const newUid = lastUid ? +lastUid.uid + 1 : 1;

    if (lastUid) {
      console.log("Given the conversation ID");
    } else {
      const conversation = new Conversation({
        userId: senderId,
        receiverId: receiverId,
        uid: newUid,
      });
      const newConversation = await conversation.save();
      console.log("newConversation", newConversation);
    }

    // Emit the message to the recipient's socket
    io.to(receiverId).emit('test-event', { message: question, senderId });

    res.json({
      receiveId: receiverId,
      status: true,
      success: true,
      message: savedMessage,
      answer: answer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};




exports.chatsMessageList = (async (req, res) => {
  console.log(req.params)
  const { receiveId } = req.params;
  console.log("receiveId", receiveId,)
  try {
    const records = await Chat.find({ receiveId: receiveId });
    console.log("records", records)
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
