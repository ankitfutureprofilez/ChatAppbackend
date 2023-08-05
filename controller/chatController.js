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

const openai = new OpenAIApi(configuration);
exports.findAnswer = async (req, res) => {
  try {
    const userQuestion = req.body.question;
    const fields = ['React.js', 'Node.js', 'PHP',"Web Development" ,"Web App"]; // Specify the relevant fields
    const companyDetails = "My company is future profilez and it is a web development company in jaipur india."; // Pass your company details in the request body

    const questions = `
    Q. Our company future profilez is location is in Bani Park jaipur india. 
    Q. Our website is https://futureprofilez.com
    Q. Our company has always vacancy for fresher , intern and experince , can you share your resume by visiting our website.
     https://futureprofilez.com/career/
     Q. Our company opening for experince  for visit our website link https://futureprofilez.com/career/ and connect with HR. Harsha . contant number +91-9983333334 please submit your resume on whatapps and email's 
    Q. We works on all web development technologies such as react js, node js,php ,mobile app ,web development ,
    Q. Our Company owner Name  Mr.Vishal Solanki.
    Q. yes,our company full fii your job need please share your resume our website  https://futureprofilez.com/career/
    Q. our company contact number :+91 9983333334.
    Q. If user ask then our contact details are whatsapp no +919983333334, info@futureprofilez.com, +91-9983333334. 
    `;

    if (!userQuestion || !companyDetails) {
      return res.status(400).json({
        msg: 'Bad Request: Missing question or companyDetails field in the request body.',
        status: 400,
      });
    }

    const prompt = `Prompt: You are an AI Assistant for a web development company.
      Read belows details of our company to help users ${userQuestion}
      '''
      Please provide answer based on above information given. If my query not matches with above or try to find it on our website https://futureprofilez.com or search it on google then give relevent answer for that query based on my business
      '''
      And if query is not related to web develpment then deny with a pleasent message.
      '''
      Answer their queries and ask other related information Query "${userQuestion}"
    `;
    //text-ada-001
    //text-davinci-002
    //text-davinci-001
    //'text-curie-001',
    // temperature:0.5,
    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      temperature: 0.8,
      max_tokens: 150

    });
    const assistantAnswer = completion.data.choices[0].text;
    const savedEntry = await QuestionAnswer.create({
      question: userQuestion,
      answer: assistantAnswer,
    });
    res.json({
      status: 200,
      data: assistantAnswer,
      msg: 'Successfully Retrieved Answer',
      savedEntry: savedEntry,
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


exports.find = async (req, res) => {
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
    const isCompanyQuestion = isWebCompanyRelatedQuestion(userQuestion);

    let assistantAnswer;

    if (isWebDevelopmentQuestion) {
      // Use AI-generated answer using the text-davinci-002 model
      const completion = await openai.createCompletion({
        model: 'text-ada-001',
        prompt: userQuestion,
        max_tokens: 150,
      });
      assistantAnswer = completion.data.choices[0].text;
    } else if (isCompanyQuestion) {
      // Handle different company-related questions using specific responses
      assistantAnswer = handleCompanyQuestion(userQuestion);
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

function isWebDevelopmentRelatedQuestion(question) {
  const webDevKeywords = ['MEAN', "React", "Node", "MERN", 'HTML', 'CSS', 'JavaScript', 'framework'];
  return webDevKeywords.some((keyword) => question.toLowerCase().includes(keyword.toLowerCase()));
}

function isWebCompanyRelatedQuestion(question) {
  const companyKeywords = ['name', 'services', 'location', "review", "about"];
  return companyKeywords.some((keyword) => question.toLowerCase().includes(keyword));
}

// Function to handle different company-related questions using specific responses
function handleCompanyQuestion(question) {
  const companyResponses = {
    'name': "My company Name is Future Profilez.",
    'services': "My company provides services in Mobile, E-business, PHP, Laravel Development, CakePHP Development, Zend Development, CodeIgniter Development, Yii Development, Custom PHP Development, PHP MySQL Development.",
    'location': "My company is located at Office No. D-105B, G-4, Golden OAK-1, Devi Marg, Bani Park, Jaipur, Rajasthan 302016.",
    'review': "My company has a Google Review rating of 4.9.",
    'about': "Sure, I can provide some general information about my company. It is a web development company in Jaipur, India. My company works with PHP, Laravel, Shopify, Magento, and MERN Stack."
  };

  const keywords = Object.keys(companyResponses);

  for (const keyword of keywords) {
    if (question.toLowerCase().includes(keyword)) {
      return companyResponses[keyword];
    }
  }

  return "I am not fielded this type of question.";
}




    




exports.conversion = (async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.body.userB;
    console.log("senderId", senderId)
    console.log("receiverId", receiverId)
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
    });
  }

})

exports.sendMessage = async (req, res) => {
  try {
    const receiverId = req.body.receiverId;
    const senderId = req.user.userId; // Assuming the authenticated user's ID is available in req.user.userId

    const chatMessage = new Chat({
      message: req.body.message,
      userId: senderId,
      receiveId: receiverId,

    });

    const savedMessage = await chatMessage.save();
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
    }

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
