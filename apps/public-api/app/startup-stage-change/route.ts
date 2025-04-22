import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     StartupStageChange:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         startupId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: Optional ID of the startup application
 *         fromStage:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *           description: Previous stage of the startup
 *         toStage:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *           description: New stage of the startup
 *         changedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user who made the change
 *         changedAt:
 *           type: string
 *           format: date-time
 *           description: When the change was made
 *         notes:
 *           type: string
 *           maxLength: 1000
 *           description: Optional notes about the stage change
 *         startup:
 *           $ref: '#/components/schemas/StartupBasic'
 *         startupApplication:
 *           $ref: '#/components/schemas/StartupApplicationBasic'
 *         user:
 *           $ref: '#/components/schemas/UserBasic'
 *       required:
 *         - startupId
 *         - fromStage
 *         - toStage
 *         - changedBy
 *
 *     StartupStageChangeInput:
 *       type: object
 *       properties:
 *         startupId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: Optional ID of the startup application
 *         fromStage:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *           description: Previous stage of the startup
 *         toStage:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *           description: New stage of the startup
 *         changedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user making the change
 *         notes:
 *           type: string
 *           maxLength: 1000
 *           description: Optional notes about the stage change
 *       required:
 *         - startupId
 *         - fromStage
 *         - toStage
 *         - changedBy
 *
 *     StartupBasic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         stage:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *
 *     StartupApplicationBasic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         evaluationStage:
 *           type: string
 *           enum: [L1, L2, L2_5, L3, L4]
 *         evaluationStatus:
 *           type: string
 *           enum: [SUBMITTED, IN_REVIEW, ON_HOLD, PASSED, DROPPED]
 *
 *     UserBasic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *
 * @swagger
 * /startup/{startupId}/stage-change:
 *   get:
 *     summary: Get all startup stage changes
 *     description: Retrieve a list of all startup stage changes with pagination and filters
 *     tags: [StartupStageChange]
 *     parameters:
 *       - in: path
 *         name: startupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by startup ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: fromStage
 *         schema:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *         description: Filter by previous stage
 *       - in: query
 *         name: toStage
 *         schema:
 *           type: string
 *           enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *         description: Filter by new stage
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in notes and startup name
 *     responses:
 *       200:
 *         description: Successfully retrieved startup stage changes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StartupStageChange'
 *                 total:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPreviousPage:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new startup stage change
 *     description: Create a new startup stage change record
 *     tags: [StartupStageChange]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupStageChangeInput'
 *     responses:
 *       201:
 *         description: Successfully created startup stage change
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupStageChange'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Related resource not found
 *       500:
 *         description: Internal server error
 *
 * @swagger
 * /startup/{startupId}/stage-change/{id}:
 *   get:
 *     summary: Get startup stage change by ID
 *     description: Retrieve a specific startup stage change by its ID
 *     tags: [StartupStageChange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: startupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by startup ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup stage change
 *     responses:
 *       200:
 *         description: Successfully retrieved startup stage change
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupStageChange'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Startup stage change not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update startup stage change
 *     description: Update an existing startup stage change by ID
 *     tags: [StartupStageChange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup stage change
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromStage:
 *                 type: string
 *                 enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *                 description: Previous stage of the startup
 *               toStage:
 *                 type: string
 *                 enum: [IDEATION, MVP, EARLY_TRACTION, SCALING]
 *                 description: New stage of the startup
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Optional notes about the stage change
 *     responses:
 *       200:
 *         description: Successfully updated startup stage change
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupStageChange'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Startup stage change not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete startup stage change
 *     description: Delete a startup stage change by ID
 *     tags: [StartupStageChange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup stage change
 *     responses:
 *       200:
 *         description: Successfully deleted startup stage change
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Startup stage change deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Startup stage change not found
 *       500:
 *         description: Internal server error
 */

export const GET = withAuth(async (req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
