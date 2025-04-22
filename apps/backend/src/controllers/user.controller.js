const { response } = require('../helpers');

getProfile = async (req, res, next) => {
  try {
    const user = { ...req.user };
    delete user['password'];

    return response.success(req, res, user, 'User profile');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getProfile,
};
