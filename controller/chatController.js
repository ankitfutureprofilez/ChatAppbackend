const Chat = require('../models/Messages')
const user = require('../models/Users')
const Conversation = require("../models/Converstion")
const io = require('socket.io')(); // Don't need this since io is initialized in the server file
const QuestionAnswer = require('../models/OpenAi')
require('dotenv').config()


const { Configuration, OpenAIApi } = require("openai");

const ApiKey = process.env.OPENAI_API_KEY
console.log("ApiKey", ApiKey)

const configuration = new Configuration({
  apiKey: ApiKey,
});

///console.log("configuration",configuration)
const openai = new OpenAIApi(configuration);
//console.log("openai", openai)

exports.findAnswer = async (req, res) => {
  try {
    const userQuestion = req.body.question;
    console.log("userQuestion", userQuestion)
    if (!userQuestion) {
      return res.status(400).json({
        msg: 'Bad Request: Missing question field in the request body.',
        status: 400,
      });
    }

    // Generate a response from OpenAI
    const completion = await openai.createCompletion({
      model: 'text-davinci-001',
      prompt: userQuestion,
    });
    console.log("completion", completion)
    const assistantAnswer = completion.data.choices[0].text;
    console.log("assistantAnswer", assistantAnswer)

    // Save the user question and the assistant's answer to the MongoDB collection
    const savedEntry = await QuestionAnswer.create({
      question: userQuestion,
      answer: assistantAnswer,
    });
    console.log("savedEntry", savedEntry)
    // Send the answer as a response to the client
    res.json({
      status: 200,
      data: assistantAnswer,
      msg: 'Successfully Retrieved Answer',
      savedEntry: savedEntry, // Optional: Send the saved database entry back in the response
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: err,
      msg: 'Error Detected',
      status: 400,
    });
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
    // Save the question and answer to the database
    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiverId: receiverId,

    });
    const savedMessage = await chatMessage.save();
    console.log("savedMessage",savedMessage)
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
    io.to(receiverId).emit('test-event', { message: req.body.message, senderId });
    res.json({
      receiverId: receiverId,
      status: true,
      success: true,
      message: savedMessage
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};


exports.chatsMessageList = (async (req, res) => {
  //console.log(req.params)
  const { receiverId } = req.params;
 // console.log("receiveId", receiveId,)
  try {
    const records = await Chat.find({ receiverId: receiverId });
 //   console.log("records", records)
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
