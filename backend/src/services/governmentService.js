const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const getServices = async (query) => {
  const {
    search,
    departmentId,
    categoryId,
    page = 1,
    limit = 10,
    includeInactive = false,
  } = query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  if (!includeInactive) where.isActive = true;
  if (departmentId) where.departmentId = Number(departmentId);
  if (categoryId) where.categoryId = Number(categoryId);

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.governmentService.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { id: "desc" },
      include: {
        department: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.governmentService.count({ where }),
  ]);

  return {
    items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getServiceById = async (id) => {
  const service = await prisma.governmentService.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
      knowledgeEntries: true,
    },
  });

  if (!service) throw new ApiError(404, "Service not found.");
  return service;
};

const createService = async (payload) => {
  const [department, category] = await Promise.all([
    prisma.department.findUnique({ where: { id: payload.departmentId } }),
    prisma.serviceCategory.findUnique({ where: { id: payload.categoryId } }),
  ]);

  if (!department) throw new ApiError(404, "Department not found.");
  if (!category) throw new ApiError(404, "Category not found.");

  return prisma.governmentService.create({ data: payload });
};

const updateService = async (id, payload) => {
  const existing = await prisma.governmentService.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Service not found.");

  return prisma.governmentService.update({
    where: { id },
    data: payload,
  });
};

const deleteService = async (id) => {
  const existing = await prisma.governmentService.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Service not found.");

  return prisma.governmentService.delete({ where: { id } });
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};