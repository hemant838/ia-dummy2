class ServiceUnavailable extends Error {
  constructor(message = 'Service Unavailable') {
    super();
    this.status = 503;
    this.message = message;
  }
}

module.exports = ServiceUnavailable;
