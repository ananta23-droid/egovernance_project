const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const getAllDepartments = async () => {
  return prisma.department.findMany({ orderBy: { id: "asc" } });
};

const createDepartment = async (payload) => {
  return prisma.department.create({ data: payload });
};

const updateDepartment = async (id, payload) => {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Department not found.");

  return prisma.department.update({
    where: { id },
    data: payload,
  });
};

const deleteDepartment = async (id) => {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Department not found.");

  return prisma.department.delete({ where: { id } });
};

module.exports = { getAllDepartments, createDepartment, updateDepartment, deleteDepartment };