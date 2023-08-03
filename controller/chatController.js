const Chat = require('../models/Messages')
const user = require('../models/Users')
const Conversation = require("../models/Converstion")
const io = require('socket.io')(); // Don't need this since io is initialized in the server file
const QuestionAnswer = require('../models/OpenAi')
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
const ApiKey = process.env.OPENAI_API_KEY

const configuration = new Configuration({
  apiKey: ApiKey,
});

//console.log("configuration",configuration)
const openai = new OpenAIApi(configuration);
exports.findAnswer = async (req, res) => {
  try {
    const userQuestion = req.body.question;

    if (!userQuestion) {
      return res.status(400).json({
        msg: 'Bad Request: Missing question field in the request body.',
        status: 400,
      });
    }

    // Check if the user's question is related to web development
    const isWebDevelopmentQuestion = isWebDevelopmentRelatedQuestion(userQuestion);
    const iscompanyQuestion = isWebCompanyRelatedQuestion(userQuestion)
    let assistantAnswer;
    if (isWebDevelopmentQuestion) {
      // Use AI-generated answer using the text-davinci-002 model
      const completion = await openai.createCompletion({
        model: 'text-ada-001',
        prompt: userQuestion,
        max_tokens: 150,
      });
      assistantAnswer = completion.data.choices[0].text;
    } else if (iscompanyQuestion) {
      // Use AI-generated answer using the text-davinci-002 model for company-related questions
      const completion = await openai.createCompletion({
        model: 'text-ada-001',
        prompt: userQuestion,
        max_tokens: 150,
      });
      assistantAnswer = completion.data.choices[0].text;
    } else {
      // If the question is not related to web development or company, reply with a default message
      assistantAnswer = "I am not fielded this type of question.";
    }  
    // Save the user question and the assistant's answer to the MongoDB collection
    const savedEntry = await QuestionAnswer.create({
      question: userQuestion,
      answer: assistantAnswer,
    });

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

// Helper function to check if a question is related to web development
function isWebDevelopmentRelatedQuestion(question) {
  const webDevKeywords = ['MEAN', "React", "Node", "MERN", 'HTML', 'CSS', 'JavaScript', 'fram ework'];
  return webDevKeywords.some((keyword) => question.toLowerCase().includes(keyword.toLowerCase()));
}


function isWebCompanyRelatedQuestion(question) {
  const companyPhrases = [
    "my company name is future ProfileZ ",
    "company services PHP,Laravel Development,CakePHP Development,Zend Development,CodeIgniter Development,Yii Development,Custom PHP Development,PHP MySQL Development",
    "company location  Office No. D-105B, G-4, Golden OAK-1, Devi Marg, Bani Park, Jaipur, Rajasthan 302016",
    // Add more specific phrases related to a company if needed
  ];
  return companyPhrases.some((phrase) => question.toLowerCase().includes(phrase));
}



// exports.findAnswer = async (req, res) => {
//   try {
//     const userQuestion = req.body.question;
//     const fields = ['React.js', 'Node.js', 'PHP', 'react js']; // Specify the relevant fields
//     const companyDetails = "My company name future profilez .my company owner name Vishal ,  Company Stablished in 2005 .  it is a web development company in jaipur india.my Company Working Time is 9:30 AM  to 6:30 PM .My Company work it PHP, laravel, shopify, mangto and Mern Stack.my Company Google Review 4.9 in all time . my company provide multiple Services  Mobile, E - business,   PHP, Laravel Development, CakePHP Development, Zend Development, CodeIgniter Development, Yii Development, Custom PHP Development, PHP MySQL Development  my company Location is  Office No.D - 105B, G - 4, Golden OAK - 1, Devi Marg, Bani Park, Jaipur, Rajasthan 302016. "; // Pass your company details in the request body
//     if (!userQuestion || !companyDetails) {                      
//       return res.status(400).json({                
//         msg: 'Bad Request: Missing question or companyDetails field in the request body.',
//         status: 400,
//       });   
//     }  

//     // Combine all the fields, company details, and the user's question in the prompt
//     const prompt = `${companyDetails} ${fields.map((field) => `In the field of ${field},`).join(' ')} ${userQuestion}`;

//     const completion = await openai.createCompletion({
//       model: 'text-davinci-002',
//       prompt: prompt
//     });

//     const assistantAnswer = completion.data.choices[0].text;

//     // Filter the answer to ensure it relates to one of the specified fields
//     const relevantField = fields.find((field) => assistantAnswer.toLowerCase().includes(field.toLowerCase()));
//     if (!relevantField) {
//       return res.status(200).json({
//         data: "Sorry, I couldn't find a relevant answer in the specified fields.",
//         msg: 'Successfully Retrieved Answer',
//       });
//     }

//     const savedEntry = await QuestionAnswer.create({
//       question: userQuestion,
//       answer: assistantAnswer,
//       field: relevantField, // Save the specific field along with the question and answer
//     });

//     res.json({
//       status: 200,
//       data: assistantAnswer,
//       msg: 'Successfully Retrieved Answer',
//       savedEntry: savedEntry, // Optional: Send the saved database entry back in the response
//     });
//   } catch (err) {
//     console.log(err);
//     res.json({
//       err: err,
//       msg: 'Error Detected',
//       status: 400,
//     });
//   }
// };


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

    // Process the question and get the answe
    // Save the question and answer to the database
    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiveId: receiverId,

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
      //  console.log("newConversation", newConversation);
    }

    // Emit the message to the recipient's socket
    io.to(receiverId).emit('test-event', { message: req.body.message, senderId });

    res.json({
      receiveId: receiverId,
      status: true,
      success: true,
      message: savedMessage,

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
