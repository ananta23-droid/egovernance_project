const bcrypt = require("bcrypt");
const { PrismaClient, Role } = require("@prisma/client");
const { generateToken } = require("../config/jwt");
const ApiError = require("../utils/apiError");

const prisma = new PrismaClient();

const registerUser = async ({ fullName, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "Email already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: Role.USER,
    },
  });

  const token = generateToken({ userId: newUser.id, role: newUser.role });

  return {
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = { registerUser, loginUser };