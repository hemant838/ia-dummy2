class ConfirmOrderTimeoutException extends Error {
  constructor() {
    super();
    this.status = 201;
    this.message = `Confirm Order Timeout`;
  }
}

module.exports = ConfirmOrderTimeoutException;
