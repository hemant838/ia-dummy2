const { startupApplicationService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllStartupApplications = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const {
      startupId,
      programId,
      eirId,
      evaluationStage,
      evaluationStatus,
      search,
    } = req.query;

    const { data, total } = await startupApplicationService.fetchAll({
      skip,
      take,
      startupId,
      programId,
      eirId,
      evaluationStage,
      evaluationStatus,
      search,
    });

    const paginatedResponse = pagination.getPaginatedResponse(
      data,
      total,
      page,
      pageSize,
    );
    return response.success(
      req,
      res,
      paginatedResponse,
      'Startup applications retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getStartupApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup application ID is required');
    }

    const application = await startupApplicationService.fetchById(id);
    return response.success(
      req,
      res,
      application,
      'Startup application retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createStartupApplication = async (req, res, next) => {
  try {
    const payload = req.body;
    const newApplication = await startupApplicationService.create(payload);
    return response.success(
      req,
      res,
      newApplication,
      'Startup application created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateStartupApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Startup application ID is required');
    }

    const updated = await startupApplicationService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Startup application updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const deleteStartupApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup application ID is required');
    }

    const deleted = await startupApplicationService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Startup application deleted successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const updateEvaluationStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    if (!id) {
      throw new BadRequest('Startup application ID is required');
    }
    if (!stage) {
      throw new BadRequest('Evaluation stage is required');
    }

    const updated = await startupApplicationService.updateStage(id, stage);
    return response.success(
      req,
      res,
      updated,
      'Evaluation stage updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const updateEvaluationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw new BadRequest('Startup application ID is required');
    }
    if (!status) {
      throw new BadRequest('Evaluation status is required');
    }

    const updated = await startupApplicationService.updateStatus(id, status);
    return response.success(
      req,
      res,
      updated,
      'Evaluation status updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

// const addNote = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const payload = req.body;

//     if (!id) {
//       throw new BadRequest('Startup application ID is required');
//     }

//     const updated = await startupApplicationService.addNote(id, payload);
//     return response.success(req, res, updated, 'Note added successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

// const addMetric = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const payload = req.body;

//     if (!id) {
//       throw new BadRequest('Startup application ID is required');
//     }

//     const updated = await startupApplicationService.addMetric(id, payload);
//     return response.success(req, res, updated, 'Metric added successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

// const addCompetitor = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const payload = req.body;

//     if (!id) {
//       throw new BadRequest('Startup application ID is required');
//     }

//     const updated = await startupApplicationService.addCompetitor(id, payload);
//     return response.success(req, res, updated, 'Competitor added successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

// const addDocument = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const payload = req.body;

//     if (!id) {
//       throw new BadRequest('Startup application ID is required');
//     }

//     const updated = await startupApplicationService.addDocument(id, payload);
//     return response.success(req, res, updated, 'Document added successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

// const removeNote = async (req, res, next) => {
//   try {
//     const { id, noteId } = req.params;

//     if (!id || !noteId) {
//       throw new BadRequest(
//         'Both startup application ID and note ID are required',
//       );
//     }

//     const updated = await startupApplicationService.removeNote(id, noteId);
//     return response.success(req, res, updated, 'Note removed successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

// const removeMetric = async (req, res, next) => {
//   try {
//     const { id, metricId } = req.params;

//     if (!id || !metricId) {
//       throw new BadRequest(
//         'Both startup application ID and metric ID are required',
//       );
//     }

//     const updated = await startupApplicationService.removeMetric(id, metricId);
//     return response.success(req, res, updated, 'Metric removed successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

// const removeCompetitor = async (req, res, next) => {
//   try {
//     const { id, competitorId } = req.params;

//     if (!id || !competitorId) {
//       throw new BadRequest(
//         'Both startup application ID and competitor ID are required',
//       );
//     }

//     const updated = await startupApplicationService.removeCompetitor(
//       id,
//       competitorId,
//     );
//     return response.success(
//       req,
//       res,
//       updated,
//       'Competitor removed successfully',
//     );
//   } catch (err) {
//     return next(err);
//   }
// };

// const removeDocument = async (req, res, next) => {
//   try {
//     const { id, documentId } = req.params;

//     if (!id || !documentId) {
//       throw new BadRequest(
//         'Both startup application ID and document ID are required',
//       );
//     }

//     const updated = await startupApplicationService.removeDocument(
//       id,
//       documentId,
//     );
//     return response.success(req, res, updated, 'Document removed successfully');
//   } catch (err) {
//     return next(err);
//   }
// };

module.exports = {
  getAllStartupApplications,
  getStartupApplicationById,
  createStartupApplication,
  updateStartupApplication,
  deleteStartupApplication,
  updateEvaluationStage,
  updateEvaluationStatus,
  // addNote,
  // addMetric,
  // addCompetitor,
  // addDocument,
  // removeNote,
  // removeMetric,
  // removeCompetitor,
  // removeDocument,
};
