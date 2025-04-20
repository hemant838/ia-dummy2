const startupService = require('./startup.service.js');
const contactService = require('./contact.service.js');
const thesisService = require('./thesis.service.js');
const authService = require('./auth.service.js');
const organizationService = require('./organization.service.js');
const programService = require('./program.service.js');
const mentorshipService = require('./mentorship.service.js');

module.exports = {
  startupService,
  contactService,
  thesisService,
  authService,
  organizationService,
  programService,
  mentorshipService,
};
