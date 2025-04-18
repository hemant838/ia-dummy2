const { authService } = require('../services');
const { response } = require('../helpers');
const config = require('../configs/app.config');

login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    const { refreshToken } = data;

    // Send refresh token as cookie (not in body)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return response.success(req, res, data, 'Logged in successfully');
  } catch (err) {
    return next(err);
  }
};

register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return response.success(req, res, data, 'Registered successfully', 201);
  } catch (err) {
    return next(err);
  }
};

logout = async (req, res, next) => {
  try {
    await authService.logout(req.user);
    return response.success(req, res, null, 'Logged out successfully');
  } catch (err) {
    return next(err);
  }
};

getProfile = async (req, res, next) => {
  try {
    const user = { ...req.user };
    delete user['password'];

    return response.success(req, res, user, 'User profile');
  } catch (err) {
    return next(err);
  }
};

refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Unauthorized('No refresh token');

    const data = await authService.refreshTokens(refreshToken);

    // Reset cookie
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return response.success(req, res, data, 'Token refreshed');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  register,
  logout,
  getProfile,
  refresh,
};
