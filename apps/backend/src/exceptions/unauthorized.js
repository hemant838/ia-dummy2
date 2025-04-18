class OrderPending extends Error {
  constructor() {
    super();
    this.status = 401;
    this.message = `Unauthorized`;
  }
}

module.exports = OrderPending;
