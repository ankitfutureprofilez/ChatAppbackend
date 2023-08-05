//  const natural = require('natural');

//  console.log(natural.PorterStemmer.tokenizeAndStem("I can visit my home town "))

// // const { openai } = require('openai');
// //  const Chat = require('../models/Messages')

//  console.log(natural.HammingDistance("ankit", "amfit", false));
// // // console.log(natural.HammingDistance("karolin", "kerstin", false));

//  var tokenizer = new nlp.WordTokenizer(); 

// console.log(tokenizer.tokenize("This sentence is very short. It is ok."));



// // // var classifier = new natural.BayesClassifier();
// // // classifier.addDocument('i am long qqqq', 'buy');
// // // classifier.addDocument('buy the q\'s', 'buy');
// // // classifier.addDocument('short gold', 'sell');
// // // classifier.addDocument('sell gold', 'sell');
// // // classifier.train();

// // // console.log(classifier.classify('i am sell silver'));
// // // console.log(classifier.classify('i am long copper'));



// // // var Analyzer = natural.SentimentAnalyzer;
// // // var stemmer = natural.PorterStemmer;
// // // var analyzer = new Analyzer("English", stemmer, "afinn");

// // // // getSentiment expects an array of strings
// // // console.log(analyzer.getSentiment(["I", "don't", "want", "to", "play", "with", "you"]));



// // // const { NlpManager } = require('node-nlp');

// // // const manager = new NlpManager({ languages: ['en'], forceNER: true });
// // // // Adds the utterances and intents for the NLP
// // // manager.addDocument('en', 'goodbye for now', 'greetings.bye');
// // // manager.addDocument('en', 'bye bye take care', 'greetings.bye');
// // // manager.addDocument('en', 'okay see you later', 'greetings.bye');
// // // manager.addDocument('en', 'bye for now', 'greetings.bye');
// // // manager.addDocument('en', 'i must go', 'greetings.bye');
// // // manager.addDocument('en', 'hello', 'greetings.hello');
// // // manager.addDocument('en', 'hi', 'greetings.hello');
// // // manager.addDocument('en', 'howdy', 'greetings.hello');

// // // // Train also the NLG
// // // manager.addAnswer('en', 'greetings.bye', 'Till next time');
// // // manager.addAnswer('en', 'greetings.bye', 'see you soon!');
// // // manager.addAnswer('en', 'greetings.hello', 'Hey there!');
// // // manager.addAnswer('en', 'greetings.hello', 'Greetings!');

// // // // Train and save the model.
// // // (async() => {
// // //     await manager.train();
// // //     manager.save();
// // //     const response = await manager.process('en', 'I should go now');
// // //     console.log(response);
// // // // })();



// // const natural = require('natural');
// // const { openai } = require('openai');
// // const Chat = require('../models/Messages')
// // // ... Your existing code ...

// // exports.ai = async (req, res) => {
// //   try {
// //     const userQuestion = req.body.question;
// //     // ... Your existing code ...

// //     const tokenizer = new natural.WordTokenizer();
// //     const userTokens = tokenizer.tokenize(userQuestion.toLowerCase());

// //     // Iterate through each question and check for a match
// //     for (const question of questions.split('\n')) {
// //       const questionTokens = tokenizer.tokenize(question.toLowerCase());

// //       // If at least 80% of the tokens match, consider it a match
// //       const similarity = natural.JaroWinklerDistance(userTokens.join(' '), questionTokens.join(' '));
// //       if (similarity >= 0.8) {
// //         const answer = question.substring(3); // Remove 'Q. ' from the start
// //         return res.json({
// //           status: 200,
// //           data: answer.trim(),
// //           msg: 'Successfully Retrieved Answer',
// //         });
// //       }
// //     }

// //     // If no exact match found, use the AI model for the response
// //     const prompt = `Prompt: You are an AI Assistant for a web development company.
// //       Read below details of our company to help users ${userQuestion}
// //       ''' ... (rest of your prompt) ... `;
// //     // ... Your existing code for calling the AI model ...
// //   } catch (err) {
// //     console.log(err);
// //     res.json({
// //       err: err,
// //       msg: 'Error Detected',
// //       status: 400,
// //     });
// //   }
// // };


//  const Chat = require('../models/Messages')
// const QuestionAnswer = require('../models/OpenAi')
// require('dotenv').config();

// const { Configuration, OpenAIApi } = require("openai");
// const ApiKey = process.env.OPENAI_API_KEY

// const configuration = new Configuration({
//   apiKey: ApiKey,

// });
// const openai = new OpenAIApi(configuration);
// exports.Ai = async (req, res) => {
//     try {
//       const userQuestion = req.body.question;
//       const predefinedKeyword = req.body.keyword; // Get the predefined keyword from the request body
      
//       if (!userQuestion || !predefinedKeyword) {
//         return res.status(400).json({
//           msg: 'Bad Request: Missing question or keyword field in the request body.',
//           status: 400,
//         });
//       }
  
//       // Check if the user's question is related to web development based on the predefined keyword
//       const isWebDevelopmentQuestion = isWebDevelopmentRelatedQuestion(userQuestion, predefinedKeyword);
  
//       let assistantAnswer;
//       if (isWebDevelopmentQuestion) {
//         // Use AI-generated answer using the text-davinci-002 model
//         const completion = await openai.createCompletion({
//           model: 'text-davinci-002',
//           prompt: userQuestion,
//         });
//         assistantAnswer = completion.data.choices[0].text;
//       } else {
//         // If the question is not related to web development, reply with a default message
//         assistantAnswer = "I am not fielded this type of question.";
//       }
  
//       // Save the user question and the assistant's answer to the MongoDB collection
//       const savedEntry = await QuestionAnswer.create({
//         question: userQuestion,
//         answer: assistantAnswer,
//       });
  
//       // Send the answer as a response to the client
//       res.json({
//         status: 200,
//         data: assistantAnswer,
//         msg: 'Successfully Retrieved Answer',
//         savedEntry: savedEntry, // Optional: Send the saved database entry back in the response
//       });
//     } catch (err) {
//       console.log(err);
//       res.json({
//         err: err,
//         msg: 'Error Detected',
//         status: 400,
//       });
//     }
//   };
  
//   // Helper function to check if a question is related to web development based on a predefined keyword
//   function isWebDevelopmentRelatedQuestion(question, predefinedKeyword) {
//     const webDevKeywords = ['web development', 'frontend', 'backend', 'HTML', 'CSS', 'JavaScript', 'framework'];
//     const lowercaseQuestion = question.toLowerCase();
//     const lowercasePredefinedKeyword = predefinedKeyword.toLowerCase();
//     return (
//       webDevKeywords.some((keyword) => lowercaseQuestion.includes(keyword.toLowerCase())) ||
//       lowercaseQuestion.includes(lowercasePredefinedKeyword)
//     );
//   } 
  