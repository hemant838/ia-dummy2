const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();

const { BadRequest, Unauthorized, ValidationErrors } = require('../exceptions');
const config = require('../configs/app.config');

const JWT_SECRET = config.jwtSecret;

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

function generateTokens(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    emailVerified: user.emailVerified || false,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
}

login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ValidationErrors(null, 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Unauthorized('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Unauthorized('Invalid email or password');

  const token = generateTokens(user);

  return { ...token, user };
};

register = async (payload) => {
  const requiredFields = ['name', 'email', 'password'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ValidationErrors(null, `${field} is required`);
    }
  }

  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existing) throw new BadRequest('Email already in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  const token = generateTokens(newUser);

  return { ...token, user: newUser };
};

logout = async (user) => {
  // Optional: Invalidate session if using JWT blacklisting or session model
  return true;
};

refreshTokens = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new Unauthorized('User not found');

    const token = generateTokens(user);

    return { ...token, user };
  } catch (err) {
    throw new Unauthorized('Invalid or expired refresh token');
  }
};

module.exports = {
  login,
  register,
  logout,
  generateTokens,
  refreshTokens,
};
