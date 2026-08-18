const { retrieveRelevantServices } = require("./knowledgeRetriever");
const { buildGroundedAnswer } = require("./promptBuilder");

const ask = async (question) => {
  const rankedResults = await retrieveRelevantServices(question, 3);
  const response = buildGroundedAnswer(question, rankedResults);
  return response;
};

module.exports = {
  ask,
};