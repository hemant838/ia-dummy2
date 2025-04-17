/* eslint-disable no-promise-executor-return */
module.exports.sleep = (ms) => new Promise((res) => setTimeout(res, ms));
