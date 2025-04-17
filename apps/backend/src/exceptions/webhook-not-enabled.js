class WebhookNotEnabled extends Error {
  constructor() {
    super();
    this.status = 200;
    this.message = 'This restaurant/outlet not using webhook flow.';
  }
}

module.exports = WebhookNotEnabled;
