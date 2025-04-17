class HasBeenProcessed extends Error {
  constructor(obj = 'Order', full = false) {
    super();
    this.status = 202;
    this.message = `${obj} has been processed.`;
    if (full) this.message = obj;
  }
}

module.exports = HasBeenProcessed;
