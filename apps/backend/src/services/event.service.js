const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, programId, eventType, search, upcoming }) => {
  try {
    const where = {};

    if (programId) {
      where.programId = programId;
    }

    if (eventType) {
      where.eventType = eventType;
    }

    if (upcoming) {
      where.date = {
        gte: new Date(),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'asc' },
        include: {
          program: {
            select: {
              id: true,
              name: true,
            },
          },
          attendees: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return { data: events, total };
  } catch (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFound(`Event with ID ${id} not found`);
    }

    return event;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching event: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['programId', 'name', 'description', 'date', 'location', 'eventType'];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate program exists
    const program = await prisma.program.findUnique({
      where: { id: data.programId },
    });

    if (!program) {
      throw new ValidationErrors(
        null,
        `Program with ID ${data.programId} not found`,
      );
    }

    // Validate dates
    const startDate = new Date(data.date);
    if (data.endDate) {
      const endDate = new Date(data.endDate);
      if (startDate > endDate) {
        throw new ValidationErrors(
          null,
          'End date cannot be earlier than start date',
        );
      }
    }

    // Validate capacity
    if (data.capacity && data.capacity < 0) {
      throw new ValidationErrors(
        null,
        'Capacity must be a positive number',
      );
    }

    return prisma.event.create({
      data,
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating event: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id and programId
    delete data.id;
    delete data.programId;

    // Check if event exists
    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Event with ID ${id} not found`);
    }

    // Validate dates
    if (data.date || data.endDate) {
      const startDate = new Date(data.date || exists.date);
      if (data.endDate) {
        const endDate = new Date(data.endDate);
        if (startDate > endDate) {
          throw new ValidationErrors(
            null,
            'End date cannot be earlier than start date',
          );
        }
      }
    }

    // Validate capacity
    if (data.capacity && data.capacity < 0) {
      throw new ValidationErrors(
        null,
        'Capacity must be a positive number',
      );
    }

    return prisma.event.update({
      where: { id },
      data,
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating event: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if event exists
    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Event with ID ${id} not found`);
    }

    return prisma.event.delete({
      where: { id },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting event: ${error.message}`);
  }
};

const addAttendee = async (eventId, userId) => {
  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) {
      throw new NotFound(`Event with ID ${eventId} not found`);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ValidationErrors(null, `User with ID ${userId} not found`);
    }

    // Check capacity
    if (event.capacity && event.attendees.length >= event.capacity) {
      throw new ValidationErrors(null, 'Event has reached maximum capacity');
    }

    // Check if user is already an attendee
    if (event.attendees.some(attendee => attendee.id === userId)) {
      throw new ValidationErrors(null, 'User is already registered for this event');
    }

    return prisma.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: { id: userId },
        },
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error adding attendee: ${error.message}`);
  }
};

const removeAttendee = async (eventId, userId) => {
  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) {
      throw new NotFound(`Event with ID ${eventId} not found`);
    }

    // Check if user is an attendee
    if (!event.attendees.some(attendee => attendee.id === userId)) {
      throw new ValidationErrors(null, 'User is not registered for this event');
    }

    return prisma.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          disconnect: { id: userId },
        },
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error removing attendee: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
  addAttendee,
  removeAttendee,
}; 