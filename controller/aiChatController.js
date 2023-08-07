const Chat = require('../models/Messages');
const Services = require('../models/Services');
const Jobs = require('../models/Jobs');
const Company = require('../models/Company')
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
  jobs: ['job', "Job Openings", "Vacancies", "Career Opportunities", "Employment", "Join Our Team",
    "Apply Now", "IT Jobs", 'opportunity', 'position', "hiring", "opening", "hire",
    "vacancy", "fresher", "experince", 'php', 'node js job', 'mern stack job', 'mern job'],

  services: ['service', "framework", "service container", "routing", "ORM",
    " Ecommerce Development", " Ecommerce website",
    " Search Engine Optimization", " Organic Traffic", " Keyword Research", "Link Building",
    "web applications", "Zend framework", "API integration",
    "content management", "modules", "responsive design", "SEO optimization", "security",
    'solution', "product uploads", "payment gateway integration", 'offer', " online store", "Front-End ", "Mobile App ", "Back-End ", "CakePHP ",
    "portfolio", "works", 'projects', 'examples', 'links', "Zend", "CodeIgniter", "  Yii", "WordPress ", "development", "Ecommerce ", "Magento ", "Shopify ", "Joomla ", "Drupal CMS ", "Smart Job Board ", "Social Engine ", "Elgg ", "Custom PHP", "PHP MySQL ", "flutter", "Ruby On Rails", "Perl", "Angular JS", "Node JS", "Open Cart", "Swoopo Clone"],
  company: ['name', 'website', 'email', 'owner', 'year', "number", "Contact", "Email", 'links', "reach", 'loaction', 'address', 'emplyees']
};
const additionDetails = [{
  companyName: "Future profilez",
  email: "info@futureprofilez.com",
  phone: "9813089043"
}];

function getModelForCollectionName(collectionName) {
  console.log("Jobs model", Jobs)
  switch (collectionName) {
    case 'jobs':
      return Jobs;
    case 'services':
      return Services;
    case 'company':
      return Company;
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
        console.log("collectionName", collectionName)
        const Model = getModelForCollectionName(collectionName);
        console.log('Collection matched', Model);
        const fetched = await Model.find({});
        console.log('Fetcheds', fetched);
        return fetched;
      })
  );
  return searchResults;
}





// Open API Configuration
const { Configuration, OpenAIApi } = require("openai");

const ApiKey = process.env.OPENAI_API_KEY
const Orgkey= process.env.ORG_API_KEY
const configuration = new Configuration({
  apiKey: ApiKey,
  organization: Orgkey
});
const openai = new OpenAIApi(configuration);


exports.findAnswer = async (req, res) => {
  try {
    const tesxt = req.body.question || "";
    const userQuestion = tesxt.toLowerCase()
    const keywords = extractKeywords(userQuestion); // extract keyword from users query
    // will find some mached collection from our keywords
    console.log("extracted keywords", keywords)
    const searchResults = await searchCollections(keywords, collectionKeywordMapping);
    console.log("searchResults", searchResults);
    const combinedData = [...additionDetails].concat(...searchResults);
    console.log("combinedData", combinedData);
    const questions = combinedData;

    const prompt = `
      I want you to act as and role play of a AI assitant of Future Profilez web development company.
      ###
      Use these information ${questions} to answer.
      ###
      Try to find it on our website https://futureprofilez.com then give relevent answer 
      for that query based on my business.
      If query is not reletad to us then deny with a pleasent information. answer this user query is "${userQuestion}"
    `;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0,
      max_tokens: 100
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
