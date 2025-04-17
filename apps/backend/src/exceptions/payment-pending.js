class PaymentPending extends Error {
  constructor(message = 'Payment Pending') {
    super();
    this.status = 402;
    this.message = message;
  }
}

module.exports = PaymentPending;
