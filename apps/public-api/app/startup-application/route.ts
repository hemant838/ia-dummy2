import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * /startup-application:
 *   get:
 *     summary: Get all startup applications
 *     description: Returns a paginated list of startup applications with optional filtering and search
 *     tags:
 *       - Startup Applications
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: startupId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by startup ID
 *       - in: query
 *         name: programId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by program ID
 *       - in: query
 *         name: eirId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by EIR ID
 *       - in: query
 *         name: evaluationStage
 *         schema:
 *           type: string
 *           enum: [L1, L2, L2_5, L3, L4]
 *         description: Filter by evaluation stage
 *       - in: query
 *         name: evaluationStatus
 *         schema:
 *           type: string
 *           enum: [SUBMITTED, IN_REVIEW, ON_HOLD, PASSED, DROPPED]
 *         description: Filter by evaluation status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in startup and program names
 *     responses:
 *       200:
 *         description: List of startup applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StartupApplication'
 *                 total:
 *                   type: integer
 *                   description: Total number of records
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pageSize:
 *                   type: integer
 *                   description: Number of items per page
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 hasNext:
 *                   type: boolean
 *                   description: Whether there are more pages after current
 *                 hasPrev:
 *                   type: boolean
 *                   description: Whether there are pages before current
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new startup application
 *     description: Create a new startup application with the provided data
 *     tags:
 *       - Startup Applications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupApplicationInput'
 *     responses:
 *       201:
 *         description: Startup application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupApplication'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /startup-application/{id}:
 *   get:
 *     summary: Get startup application by ID
 *     description: Returns detailed information about a specific startup application
 *     tags:
 *       - Startup Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
 *     responses:
 *       200:
 *         description: Startup application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupApplication'
 *       404:
 *         description: Startup application not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update startup application
 *     description: Update an existing startup application by its ID
 *     tags:
 *       - Startup Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupApplicationInput'
 *     responses:
 *       200:
 *         description: Startup application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupApplication'
 *       404:
 *         description: Startup application not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete startup application
 *     description: Delete a startup application by its ID
 *     tags:
 *       - Startup Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
 *     responses:
 *       200:
 *         description: Startup application deleted successfully
 *       404:
 *         description: Startup application not found
 *       500:
 *         description: Internal server error
 *
 * /startup-application/{id}/stage:
 *   put:
 *     summary: Update evaluation stage
 *     description: Update the evaluation stage of a startup application
 *     tags:
 *       - Startup Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stage
 *             properties:
 *               stage:
 *                 type: string
 *                 enum: [L1, L2, L2_5, L3, L4]
 *     responses:
 *       200:
 *         description: Evaluation stage updated successfully
 *       404:
 *         description: Startup application not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /startup-application/{id}/status:
 *   put:
 *     summary: Update evaluation status
 *     description: Update the evaluation status of a startup application
 *     tags:
 *       - Startup Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SUBMITTED, IN_REVIEW, ON_HOLD, PASSED, DROPPED]
 *     responses:
 *       200:
 *         description: Evaluation status updated successfully
 *       404:
 *         description: Startup application not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     StartupApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the startup application
 *         startupId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup
 *         programId:
 *           type: string
 *           format: uuid
 *           description: ID of the program
 *         eirId:
 *           type: string
 *           format: uuid
 *           description: ID of the EIR (Entrepreneur in Residence)
 *         evaluationStage:
 *           type: string
 *           enum: [L1, L2, L2_5, L3, L4]
 *           description: Current evaluation stage of the application
 *         evaluationStatus:
 *           type: string
 *           enum: [SUBMITTED, IN_REVIEW, ON_HOLD, PASSED, DROPPED]
 *           description: Current status of the application
 *         fundingAskAmount:
 *           type: number
 *           format: decimal
 *           description: Amount of funding requested
 *         fundingAskValuation:
 *           type: number
 *           format: decimal
 *           description: Valuation requested
 *         appliedAt:
 *           type: string
 *           format: date-time
 *           description: When the application was submitted
 *         startup:
 *           $ref: '#/components/schemas/Startup'
 *         program:
 *           $ref: '#/components/schemas/Program'
 *         eir:
 *           $ref: '#/components/schemas/User'
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StartupNote'
 *         metrics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StartupMetric'
 *         competitors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StartupCompetitor'
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StartupDocument'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the application was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the application was last updated
 *
 *     StartupApplicationInput:
 *       type: object
 *       required:
 *         - startupId
 *         - programId
 *         - eirId
 *       properties:
 *         startupId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup
 *         programId:
 *           type: string
 *           format: uuid
 *           description: ID of the program
 *         eirId:
 *           type: string
 *           format: uuid
 *           description: ID of the EIR
 *         evaluationStage:
 *           type: string
 *           enum: [L1, L2, L2_5, L3, L4]
 *           description: Current evaluation stage
 *         evaluationStatus:
 *           type: string
 *           enum: [SUBMITTED, IN_REVIEW, ON_HOLD, PASSED, DROPPED]
 *           description: Current status
 *         fundingAskAmount:
 *           type: number
 *           format: decimal
 *           description: Amount of funding requested
 *         fundingAskValuation:
 *           type: number
 *           format: decimal
 *           description: Valuation requested
 */

export const GET = withAuth(async (req: NextRequest, ctx) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
