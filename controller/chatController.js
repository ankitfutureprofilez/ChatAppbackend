const Chat = require('../models/Messages')
const Jobs = require('../models/Jobs')
const user = require('../models/Users')
const Conversation = require("../models/Converstion")
const io = require('socket.io')(); // Don't need this since io is initialized in the server file
const QuestionAnswer = require('../models/OpenAi')
require('dotenv').config();
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const nounInflector = new natural.NounInflector();
// KEYWORD EXTRACTOR
function extractKeywords(userQuery) {
  const tokens = tokenizer.tokenize(userQuery);
  const keywords = tokens.filter(token => !natural.stopwords.includes(token));
  const singularKeywords = keywords.map(keyword => nounInflector.singularize(keyword));
  return singularKeywords;
}

// find information using text 
// const data = await collection.find({ $text: { $search: userQuestion } }).toArray();

const collectionKeywordMapping = {
  jobs: ['job', 'opportunity', 'position'],
  services: ['service', 'solution', 'offer'],
};
const additionDetails = [{
  companyName:"Future profilez",
  email:"info@futureprofilez.com",
  phone:"9813089043"
}];

function getModelForCollectionName(collectionName) {
  console.log("Jobs model",Jobs)
  switch (collectionName) {
    case 'jobs':
      return Jobs;
    // case 'services':
    //   return Services;
    default:
      throw new Error(`Unknown collection name: ${collectionName}`);
  }
}

async function searchCollections(keywords, collectionKeywordMapping) {
  const searchResults = await Promise.all(
    Object.entries(collectionKeywordMapping)
      .filter(([collectionName, keywordList]) =>
        keywords.some(keyword => keywordList.includes(keyword))
      ).map(async ([collectionName, keywordList]) => {
        const Model = getModelForCollectionName(collectionName);
        console.log('Collection matched', Model);
        const fetched = await Model.find({});
        console.log('Fetched', fetched);
        return fetched;
      })
  );
  return searchResults;
}





// Open API Configuration
const { Configuration, OpenAIApi } = require("openai");
const ApiKey = process.env.OPENAI_API_KEY
const configuration = new Configuration({
  apiKey: ApiKey,
});
const openai = new OpenAIApi(configuration);


exports.findAnswer = async (req, res) => {
  try {
    const fetched = await Jobs.find({});
    console.log('Fetched', fetched);
    res.json({
      status: 200,
      msg: 'Successfully !!',
      data: fetched, 
    });
    return false;

    const userQuestion = req.body.question || "Tell me about job opportunities in software development";
    const keywords = extractKeywords(userQuestion); // extract keyword from users query
    // will find some mached collection from our keywords
    console.log("extracted keywords",keywords)
    const searchResults = await searchCollections(keywords, collectionKeywordMapping);
    const combinedData = [...additionDetails].concat(...searchResults);
    const questions = combinedData;
    
    const prompt = `
      I want you to act as and role play of a AI assitant of Future Profilez web development company.
      '''
      These are some information our company ${questions}
      '''
      Please provide answer based on above information given. 
      If my query not matches with above or try to find it on our 
      website https://futureprofilez.com or search it on google then give relevent answer 
      for that query based on my business.
      If query is not reletad to web or app development then deny with a pleasent information.
      Answer their queries and ask other related information query is "${userQuestion}"
    `;

    const completion = await openai.createCompletion({
      model: 'text-davinci-002' ,
      prompt: prompt,
      temperature:0,
      max_tokens:150
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
      msg: 'Something went wrong !!',
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
});


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
