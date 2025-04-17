class OrderPending extends Error {
    constructor () {
      super();
      this.status   = 202;
      this.message  = `Order pending.`;
    }
  }

  module.exports = OrderPending