const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({
  skip = 0,
  take = 10,
  startupId,
  programId,
  eirId,
  evaluationStage,
  evaluationStatus,
  search,
}) => {
  try {
    const where = {};

    if (startupId) where.startupId = startupId;
    if (programId) where.programId = programId;
    if (eirId) where.eirId = eirId;
    if (evaluationStage) where.evaluationStage = evaluationStage;
    if (evaluationStatus) where.evaluationStatus = evaluationStatus;
    if (search) {
      where.OR = [
        { startup: { name: { contains: search, mode: 'insensitive' } } },
        { program: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.startupApplication.findMany({
        where,
        skip,
        take,
        include: {
          startup: {
            include: {
              thesis: true,
              verticalPartner: true,
            },
          },
          program: true,
          eir: true,
          notes: true,
          metrics: true,
          competitors: true,
          documents: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.startupApplication.count({ where }),
    ]);

    // Collect all referredByIds
    const referredByIds = data
      .map((application) => application.startup?.referredById)
      .filter((id) => id);

    // Fetch all referredBy users in a single query
    const referredByUsers = await prisma.user.findMany({
      where: { id: { in: referredByIds } },
    });

    // Map referredBy users by ID
    const referredByMap = referredByUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // Enrich data with referredBy users
    const enrichedData = data.map((application) => ({
      ...application,
      startup: {
        ...application.startup,
        referredBy: referredByMap[application.startup?.referredById] || null,
      },
    }));

    return { data: enrichedData, total };
  } catch (error) {
    throw new Error(`Error fetching startup applications: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const application = await prisma.startupApplication.findUnique({
      where: { id },
      include: {
        startup: true,
        program: true,
        eir: true,
        notes: true,
        metrics: true,
        competitors: true,
        documents: true,
      },
    });

    if (!application) {
      throw new NotFound(`Startup application with ID ${id} not found`);
    }

    return application;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup application: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    const {
      startupId,
      programId,
      eirId,
      evaluationStage,
      evaluationStatus,
      ...rest
    } = data;

    // Validate required fields
    const required = ['startupId', 'programId'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Check if startup exists
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    });
    if (!startup) {
      throw new ValidationErrors(
        null,
        `Startup with ID ${startupId} not found`,
      );
    }

    // Check if program exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) {
      throw new ValidationErrors(
        null,
        `Program with ID ${programId} not found`,
      );
    }

    // Check if EIR exists if provided
    if (eirId) {
      const eir = await prisma.user.findUnique({
        where: { id: eirId },
      });
      if (!eir) {
        throw new ValidationErrors(null, `EIR with ID ${eirId} not found`);
      }
    }

    return prisma.startupApplication.create({
      data: {
        startupId,
        programId,
        eirId: eirId || null,
        evaluationStage: evaluationStage || 'APPLICATION_RECEIVED',
        evaluationStatus: evaluationStatus || 'SUBMITTED',
        ...rest,
      },
      include: {
        startup: true,
        program: true,
        eir: eirId ? true : false,
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating startup application: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if application exists
    const exists = await prisma.startupApplication.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup application with ID ${id} not found`);
    }

    // Prevent changing critical fields
    delete data.startupId;
    delete data.programId;

    // Validate relationships if they're being updated
    if (data.eirId) {
      const eir = await prisma.user.findUnique({
        where: { id: data.eirId },
      });
      if (!eir) {
        throw new ValidationErrors(null, `EIR with ID ${data.eirId} not found`);
      }
    }

    return prisma.startupApplication.update({
      where: { id },
      data,
      include: {
        startup: true,
        program: true,
        eir: true,
        notes: true,
        metrics: true,
        competitors: true,
        documents: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating startup application: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if application exists
    const exists = await prisma.startupApplication.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup application with ID ${id} not found`);
    }

    return prisma.startupApplication.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup application: ${error.message}`);
  }
};

const updateStage = async (id, stage) => {
  try {
    // Check if application exists
    const exists = await prisma.startupApplication.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup application with ID ${id} not found`);
    }

    // Validate stage
    const validStages = ['L1', 'L2', 'L2_5', 'L3', 'L4'];
    if (!validStages.includes(stage)) {
      throw new ValidationErrors(
        null,
        `Invalid stage. Must be one of: ${validStages.join(', ')}`,
      );
    }

    return prisma.startupApplication.update({
      where: { id },
      data: { evaluationStage: stage },
      include: {
        startup: true,
        program: true,
        eir: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(
      `Error updating startup application stage: ${error.message}`,
    );
  }
};

const updateStatus = async (id, status) => {
  try {
    // Check if application exists
    const exists = await prisma.startupApplication.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup application with ID ${id} not found`);
    }

    // Validate status
    const validStatuses = [
      'SUBMITTED',
      'IN_REVIEW',
      'ON_HOLD',
      'PASSED',
      'DROPPED',
    ];
    if (!validStatuses.includes(status)) {
      throw new ValidationErrors(
        null,
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      );
    }

    return prisma.startupApplication.update({
      where: { id },
      data: { evaluationStatus: status },
      include: {
        startup: true,
        program: true,
        eir: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(
      `Error updating startup application status: ${error.message}`,
    );
  }
};

// const addNote = async (id, data) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Validate required fields
//     if (!data.content || !data.userId) {
//       throw new ValidationErrors(null, 'Note content and user ID are required');
//     }

//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { id: data.userId },
//     });
//     if (!user) {
//       throw new ValidationErrors(null, `User with ID ${data.userId} not found`);
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         notes: {
//           create: {
//             ...data,
//             createdAt: new Date(),
//           },
//         },
//       },
//       include: {
//         notes: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound || error instanceof ValidationErrors) {
//       throw error;
//     }
//     throw new Error(
//       `Error adding note to startup application: ${error.message}`,
//     );
//   }
// };

// const addMetric = async (id, data) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Validate required fields
//     if (!data.metricType || !data.value || !data.date) {
//       throw new ValidationErrors(
//         null,
//         'Metric type, value, and date are required',
//       );
//     }

//     // Validate metric type
//     const validTypes = ['MRR', 'ARR', 'PROFIT', 'EBITDA', 'BURN'];
//     if (!validTypes.includes(data.metricType)) {
//       throw new ValidationErrors(
//         null,
//         `Invalid metric type. Must be one of: ${validTypes.join(', ')}`,
//       );
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         metrics: {
//           create: {
//             ...data,
//             createdAt: new Date(),
//           },
//         },
//       },
//       include: {
//         metrics: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound || error instanceof ValidationErrors) {
//       throw error;
//     }
//     throw new Error(
//       `Error adding metric to startup application: ${error.message}`,
//     );
//   }
// };

// const addCompetitor = async (id, data) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Validate required fields
//     if (!data.name) {
//       throw new ValidationErrors(null, 'Competitor name is required');
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         competitors: {
//           create: {
//             ...data,
//             createdAt: new Date(),
//           },
//         },
//       },
//       include: {
//         competitors: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound || error instanceof ValidationErrors) {
//       throw error;
//     }
//     throw new Error(
//       `Error adding competitor to startup application: ${error.message}`,
//     );
//   }
// };

// const addDocument = async (id, data) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Validate required fields
//     if (!data.documentType || !data.fileUrl) {
//       throw new ValidationErrors(
//         null,
//         'Document type and file URL are required',
//       );
//     }

//     // Validate document type
//     const validTypes = [
//       'INVESTMENT_NOTE',
//       'PITCH_DECK',
//       'ONE_PAGER',
//       'TERM_SHEET',
//       'MANDATE_LETTER',
//       'OTHER',
//     ];
//     if (!validTypes.includes(data.documentType)) {
//       throw new ValidationErrors(
//         null,
//         `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
//       );
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         documents: {
//           create: {
//             ...data,
//             createdAt: new Date(),
//           },
//         },
//       },
//       include: {
//         documents: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound || error instanceof ValidationErrors) {
//       throw error;
//     }
//     throw new Error(
//       `Error adding document to startup application: ${error.message}`,
//     );
//   }
// };

// const removeNote = async (id, noteId) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Check if note exists
//     const note = await prisma.startupNote.findUnique({
//       where: { id: noteId },
//     });
//     if (!note) {
//       throw new NotFound(`Note with ID ${noteId} not found`);
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         notes: {
//           delete: { id: noteId },
//         },
//       },
//       include: {
//         notes: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound) {
//       throw error;
//     }
//     throw new Error(
//       `Error removing note from startup application: ${error.message}`,
//     );
//   }
// };

// const removeMetric = async (id, metricId) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Check if metric exists
//     const metric = await prisma.startupMetric.findUnique({
//       where: { id: metricId },
//     });
//     if (!metric) {
//       throw new NotFound(`Metric with ID ${metricId} not found`);
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         metrics: {
//           delete: { id: metricId },
//         },
//       },
//       include: {
//         metrics: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound) {
//       throw error;
//     }
//     throw new Error(
//       `Error removing metric from startup application: ${error.message}`,
//     );
//   }
// };

// const removeCompetitor = async (id, competitorId) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Check if competitor exists
//     const competitor = await prisma.startupCompetitor.findUnique({
//       where: { id: competitorId },
//     });
//     if (!competitor) {
//       throw new NotFound(`Competitor with ID ${competitorId} not found`);
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         competitors: {
//           delete: { id: competitorId },
//         },
//       },
//       include: {
//         competitors: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound) {
//       throw error;
//     }
//     throw new Error(
//       `Error removing competitor from startup application: ${error.message}`,
//     );
//   }
// };

// const removeDocument = async (id, documentId) => {
//   try {
//     // Check if application exists
//     const exists = await prisma.startupApplication.findUnique({
//       where: { id },
//     });
//     if (!exists) {
//       throw new NotFound(`Startup application with ID ${id} not found`);
//     }

//     // Check if document exists
//     const document = await prisma.startupDocument.findUnique({
//       where: { id: documentId },
//     });
//     if (!document) {
//       throw new NotFound(`Document with ID ${documentId} not found`);
//     }

//     return prisma.startupApplication.update({
//       where: { id },
//       data: {
//         documents: {
//           delete: { id: documentId },
//         },
//       },
//       include: {
//         documents: true,
//       },
//     });
//   } catch (error) {
//     if (error instanceof NotFound) {
//       throw error;
//     }
//     throw new Error(
//       `Error removing document from startup application: ${error.message}`,
//     );
//   }
// };

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
  updateStage,
  updateStatus,
  // addNote,
  // addMetric,
  // addCompetitor,
  // addDocument,
  // removeNote,
  // removeMetric,
  // removeCompetitor,
  // removeDocument,
};
