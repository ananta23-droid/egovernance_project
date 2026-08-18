const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const isPrismaConnectionError = require("../utils/isPrismaConnectionError");
const { getFallbackCategories } = require("../data/fallbackCatalog");

const getCategories = async (departmentId) => {
  const where = {};
  if (departmentId) where.departmentId = departmentId;

  try {
    return await prisma.serviceCategory.findMany({
      where,
      orderBy: { id: "asc" },
      include: { department: { select: { id: true, name: true } } },
    });
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
    return getFallbackCategories(departmentId);
  }
};

const createCategory = async (payload) => {
  const department = await prisma.department.findUnique({
    where: { id: payload.departmentId },
  });
  if (!department) throw new ApiError(404, "Department not found.");

  return prisma.serviceCategory.create({ data: payload });
};

const updateCategory = async (id, payload) => {
  const existing = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Category not found.");

  return prisma.serviceCategory.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id) => {
  const existing = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Category not found.");

  return prisma.serviceCategory.delete({ where: { id } });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };