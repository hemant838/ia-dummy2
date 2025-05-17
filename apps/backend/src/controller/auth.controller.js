import { AuthService } from '../services/index.js';
import { handleError } from '../helper/errorHandler.js';
import { Unauthorized } from '../helper/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const login = async (req, res, next) => {
  try {
    const data = await AuthService.login(req.body);

    const { refreshToken } = data;

    // Send refresh token as cookie (not in body)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return handleError.success(req, res, data, 'Logged in successfully');
  } catch (err) {
    return next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const data = await AuthService.register(req.body);
    return handleError.success(req, res, data, 'Registered successfully', 201);
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await AuthService.logout(req.user);
    return handleError.success(req, res, null, 'Logged out successfully');
  } catch (err) {
    return next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = { ...req.user };
    delete user['password'];

    return handleError.success(req, res, user, 'User profile');
  } catch (err) {
    return next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Unauthorized('No refresh token');

    const data = await AuthService.refreshTokens(refreshToken);

    // Reset cookie
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: env === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return handleError.success(req, res, data, 'Token refreshed');
  } catch (err) {
    return next(err);
  }
};

export default {
  login,
  register,
  logout,
  getProfile,
  refresh,
};
