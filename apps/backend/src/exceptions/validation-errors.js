class ValidationErrors extends Error {
  constructor(errors = null, message = null, status = 400) {
    super();
    this.status = status;
    this.message = message || `Invalid request data.`;

    if (errors !== null)
      this.data = errors.details.reduce((newObj, obj) => {
        newObj[obj.context.label] = obj.message;
        return newObj;
      }, {});
  }
}

module.exports = ValidationErrors;
