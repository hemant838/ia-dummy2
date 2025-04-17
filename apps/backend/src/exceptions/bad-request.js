class BadRequest extends Error {
  constructor(message = 'Bad Request') {
    super();
    this.status = 400;
    this.message = message;
  }
}

module.exports = BadRequest;
