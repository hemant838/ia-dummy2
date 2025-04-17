class NotAccepted extends Error {
  constructor(obj = 'Request') {
    super();
    this.status = 406;
    this.message = `${obj} is not accepted.`;
  }
}

module.exports = NotAccepted;
