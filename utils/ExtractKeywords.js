const nlp = require('compromise'); // Import the compromise module from the node-nlp library

function extractKeywords(userQuery) {
  // Parse the user query using compromise
  const doc = nlp(userQuery);

  // Extract nouns as keywords
  const keywords = doc.nouns().out('array');

  return keywords;
}

module.exports = {
  extractKeywords,
};
