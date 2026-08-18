const prisma = require("../config/prisma");
const isPrismaConnectionError = require("../utils/isPrismaConnectionError");
const { getFallbackServices } = require("../data/fallbackCatalog");

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const scoreText = (questionTokens, text = "") => {
  const t = text.toLowerCase();
  let score = 0;
  for (const token of questionTokens) {
    if (token.length < 3) continue;
    if (t.includes(token)) score += 1;
  }
  return score;
};

const scoreService = (questionTokens, service) => {
  const blob = [
    service.title,
    service.description,
    service.eligibility,
    service.requiredDocuments,
    service.processSteps,
    service.feeInfo,
    service.officeInfo,
    service.department?.name,
    service.category?.name,
    ...(service.knowledgeEntries || []).flatMap((entry) => [entry.title, entry.content, entry.sourceNote]),
  ]
    .filter(Boolean)
    .join(" ");

  const titleText = `${service.title || ""} ${service.category?.name || ""} ${service.department?.name || ""}`.toLowerCase();
  let score = scoreText(questionTokens, blob);

  for (const token of questionTokens) {
    if (token.length < 3) continue;
    if (titleText.includes(token)) score += 2;
  }

  return score;
};

const loadServices = async () => {
  try {
    return await prisma.governmentService.findMany({
      where: { isActive: true },
      include: {
        department: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        knowledgeEntries: {
          where: { isVerified: true },
          select: { id: true, title: true, content: true, sourceNote: true },
          take: 2,
        },
      },
    });
  } catch (error) {
    if (!isPrismaConnectionError(error)) {
      return getFallbackServices({ includeInactive: false }).items;
    }

    return getFallbackServices({ includeInactive: false }).items;
  }
};

const retrieveRelevantServices = async (question, limit = 3) => {
  const questionTokens = tokenize(question);
  const services = await loadServices();

  const ranked = services
    .map((s) => {
      const score = scoreService(questionTokens, s);
      return { service: s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (ranked.length > 0) {
    return ranked;
  }

  return services
    .map((service) => ({ service, score: scoreService(questionTokens, service) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

module.exports = {
  retrieveRelevantServices,
};