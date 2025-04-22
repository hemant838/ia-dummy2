const commonController = require('./common.controller');
const authController = require('./auth.controller');
const startupController = require('./startup.controller');
const contactController = require('./contact.controller');
const thesisController = require('./thesis.controller');
const organizationController = require('./organization.controller');
const programController = require('./program.controller');
const mentorshipController = require('./mentorship.controller');
const investmentController = require('./investment.controller');
const eventController = require('./event.controller');
const startupApplicationController = require('./startup-application.controller');
const userController = require('./user.controller');
const founderProfileController = require('./founder-profile.controller');
const mentorProfileController = require('./mentor-profile.controller');
const investorProfileController = require('./investor-profile.controller');

const startupCompetitorController = require('./startup-competitor.controller');
const startupDocumentController = require('./startup-document.controller');
const startupMetricController = require('./startup-metric.controller');
const startupNoteController = require('./startup-note.controller');
const startupStageChangeController = require('./startup-stage-change.controller');

module.exports = {
  commonController,
  authController,
  userController,
  startupController,
  contactController,
  thesisController,
  organizationController,
  programController,
  mentorshipController,
  investmentController,
  eventController,
  startupApplicationController,
  founderProfileController,
  mentorProfileController,
  investorProfileController,
  startupCompetitorController,
  startupDocumentController,
  startupMetricController,
  startupNoteController,
  startupStageChangeController,
};
