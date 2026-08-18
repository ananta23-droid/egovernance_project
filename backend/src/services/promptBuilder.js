const isGreetingQuestion = (question) => {
  const normalized = String(question || "").toLowerCase();
  return /\b(hello|hi|hii|hey|namaste|good morning|good afternoon|good evening)\b/.test(normalized);
};

const buildGroundedAnswer = (question, rankedResults) => {
  if (isGreetingQuestion(question)) {
    return {
      answer:
        "Hello. I can help with government services like citizenship, passport, and driving license applications. Ask me what you want to apply for, and I’ll give the steps and documents.",
      sources: [],
      confidence: "high",
    };
  }

  const best = rankedResults[0]?.service;

  if (!best) {
    return {
      answer:
        "I couldn’t find an exact match for that question. Try asking about citizenship, passport, or driving license services, and I’ll point you to the right process.",
      sources: [],
      confidence: "low",
    };
  }

  const answerLines = [];
  answerLines.push(`Here is what I found for "${best.title}":`);

  if (best.description) answerLines.push(`• Description: ${best.description}`);
  if (best.eligibility) answerLines.push(`• Eligibility: ${best.eligibility}`);
  if (best.requiredDocuments) answerLines.push(`• Required Documents: ${best.requiredDocuments}`);
  if (best.processSteps) answerLines.push(`• Process Steps: ${best.processSteps}`);
  if (best.feeInfo) answerLines.push(`• Fee Info: ${best.feeInfo}`);
  if (best.officeInfo) answerLines.push(`• Office Info: ${best.officeInfo}`);
  if (best.department?.name) answerLines.push(`• Department: ${best.department.name}`);
  if (best.category?.name) answerLines.push(`• Category: ${best.category.name}`);

  // confidence heuristic
  let confidence = "medium";
  if (rankedResults[0]?.score >= 5) confidence = "high";
  if (rankedResults[0]?.score <= 2) confidence = "low";

  return {
    answer: answerLines.join("\n"),
    sources: rankedResults.map((r) => ({
      type: "service",
      id: r.service.id,
      title: r.service.title,
      score: r.score,
    })),
    confidence,
  };
};

module.exports = {
  buildGroundedAnswer,
};