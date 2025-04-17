class ModelNotFound extends Error {
  constructor(obj = 'Model', status = 404) {
    super();
    this.status = status;
    this.message = `${obj} is not found.`;
  }
}

module.exports = ModelNotFound;
