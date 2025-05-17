import pkg from 'bcryptjs';
const { compare, hash } = pkg;
import jwt from 'jsonwebtoken';
const { verify } = jwt;
import { PrismaClient } from '@workspace/database/backend-prisma-client';
const prisma = new PrismaClient();
import {handleError} from '../helper/errorHandler.js'

const { BadRequestError, Unauthorized, validationErrorHandler } = handleError;
const JWT_SECRET = process.env.JWT_SECRET;

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

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ValidationErrors(null, 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Unauthorized('Invalid email or password');

  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new Unauthorized('Invalid email or password');

   const token = generateTokens(user);

  return { user, token };
};

const register = async (payload) => {
  const requiredFields = ['name', 'email', 'password'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new validationErrorHandler(null, `${field} is required`);
    }
  }

  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existing) throw new BadRequestError('Email already in use');

  const hashedPassword = await hash(payload.password, 10);

  // Check if an organization exists
  let organization = await prisma.organization.findFirst();
  if (!organization) {
    // Create a new organization if none exists
    organization = await prisma.organization.create({
      data: {
        name: 'Default',
        stripeCustomerId: '8112fb21-1a94-47a2-8624-21cae9a467ba',
        slug: 'default'
      },
    });
  }
console.log(payload.role);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      organizationId: organization.id,
       role: payload.role || 'Generic_Support',
    },
  });

  const token = generateTokens(newUser);

  return { user: newUser, token };
};

const logout = async (user) => {
  // Optional: Invalidate session if using JWT blacklisting or session model
  res.clearCookie('next-auth.session-token');
  res.clearCookie('__Secure-next-auth.session-token');
  res.clearCookie('next-auth.csrf-token');

  return true;
};

const refreshTokens = async (refreshToken) => {
  try {
    const payload = verify(refreshToken, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new Unauthorized('User not found');

    // const token = generateTokens(user);

    return { user };
  } catch (err) {
    throw new Unauthorized('Invalid or expired refresh token');
  }
};

export default {
  login,
  register,
  logout,
  generateTokens,
  refreshTokens,
};
