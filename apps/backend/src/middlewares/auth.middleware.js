// const { auth } = require('@auth/express');

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();

const { Unauthorized } = require('../exceptions');
const config = require('../configs/app.config');

let authMiddleware;

async function getAuthMiddleware(secret) {
  if (!authMiddleware) {
    // Load the ESM-only module
    const mod = await import('@auth/express');
    console.log('##### here mod', mod);
    // Grab the named export
    const { ExpressAuth } = mod;
    authMiddleware = ExpressAuth({
      providers: [],
      secret,
      trustHost: true,
    });
  }
  return authMiddleware;
}

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new Unauthorized('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return next(new Unauthorized('User not found'));

    req.user = user;
    return next();
  } catch (err) {
    return next(new Unauthorized('Invalid or expired token'));
  }
};

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return next(new Unauthorized('User not found'));

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

const authenticateAuthJWT = async (req, res, next) => {
  try {
    const middleware = await getAuthMiddleware(config.jwtSecret);
    return middleware(req, res, next);
  } catch (err) {
    return next(err);
  }
};

module.exports = { authenticateUser, authenticateJWT, authenticateAuthJWT };
