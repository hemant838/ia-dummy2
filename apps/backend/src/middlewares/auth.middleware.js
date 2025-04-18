const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();

const { Unauthorized } = require('../exceptions');
const config = require('../configs/app.config');

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

    req.user = user || {};
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

    req.user = user || {};
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

const authenticateAuthJWT = async (req, res, next) => {
  // Step 1: Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new Unauthorized('Missing or invalid token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWS token
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    });

    // Validate expiration (handled by jwt.verify, but explicit check for clarity)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return next(new Unauthorized('Token expired'));
    }

    // Step 7: Extract userId from decoded payload
    const authId = decoded.id || decoded.sub;

    if (!authId) {
      return next(new Unauthorized('Invalid token'));
    }

    // Step 8: Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: decoded?.email },
    });

    if (!user) {
      return next(new Unauthorized('User not found'));
    }

    // Step 9: Attach user to request and proceed
    req.user = user;
    return next();
  } catch (err) {
    // Log the error for debugging
    console.error('Error during JWT authentication:', err.message);
    if (err.code) console.error('Error Code:', err.code);
    return next(new Unauthorized('Error during JWT authentication'));
  }
};

module.exports = { authenticateUser, authenticateJWT, authenticateAuthJWT };
