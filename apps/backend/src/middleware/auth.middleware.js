import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { PrismaClient } from '@workspace/database/backend-prisma-client';
import { handleError } from '../helper/errorHandler.js';
const { Unauthorized } = handleError;
const prisma = new PrismaClient();
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not set');
}

/**
 * Middleware to authenticate requests using JWT
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticate = async (req, res, next) => {
  // Step 1: Extract the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new Unauthorized('Missing or invalid authorization header'));
  }

  // Step 2: Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // Step 3: Verify the JWT token
    const decoded = verify(token, jwtSecret, {
      algorithms: ['HS256'], // Prevent algorithm downgrade attacks
    });

    // Step 4: Validate token payload
    const userId = decoded.userId || decoded.id || decoded.sub;
    if (!userId) {
      return next(new Unauthorized('Invalid token: Missing user identifier'));
    }
   let user = req.user;
    if(!req.user) {
      // Step 5: Fetch user from database
      user = await prisma.user.findUnique({
        where: { id: userId }, // Use id instead of authId
      });
    }

    if (!user) {
      return next(new Unauthorized('User not found'));
    }

    // Step 6: Attach user to request
    req.user = user;
    return next();
  } catch (err) {
    // Step 7: Handle errors
    console.error('JWT Authentication Error:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    return next(new Unauthorized('Invalid or expired token'));
  }
};

export { authenticate };