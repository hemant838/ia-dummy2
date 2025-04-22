import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * /startup-application/{applicationId}/competitor:
 *   get:
 *     summary: Get all startup competitors
 *     description: Returns a paginated list of startup competitors with optional filtering
 *     tags:
 *       - Startup Competitors
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in competitor name or description
 *     responses:
 *       200:
 *         description: List of startup competitors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StartupCompetitor'
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
 *     summary: Create a new startup competitor
 *     description: Create a new startup competitor with the provided data
 *     tags:
 *       - Startup Competitors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupCompetitorInput'
 *     responses:
 *       201:
 *         description: Startup competitor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupCompetitor'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /startup-application/{applicationId}/competitor/{id}:
 *   get:
 *     summary: Get startup competitor by ID
 *     description: Returns detailed information about a specific startup competitor
 *     tags:
 *       - Startup Competitors
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup application
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup competitor
 *     responses:
 *       200:
 *         description: Startup competitor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupCompetitor'
 *       404:
 *         description: Startup competitor not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update startup competitor
 *     description: Update an existing startup competitor by its ID
 *     tags:
 *       - Startup Competitors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup competitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupCompetitorInput'
 *     responses:
 *       200:
 *         description: Startup competitor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupCompetitor'
 *       404:
 *         description: Startup competitor not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete startup competitor
 *     description: Delete a startup competitor by its ID
 *     tags:
 *       - Startup Competitors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup competitor
 *     responses:
 *       200:
 *         description: Startup competitor deleted successfully
 *       404:
 *         description: Startup competitor not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     StartupCompetitor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the startup competitor
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup application this competitor belongs to
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Name of the competitor
 *         website:
 *           type: string
 *           format: uri
 *           maxLength: 2048
 *           description: Website URL of the competitor
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Description of the competitor
 *         startupApplication:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             startup:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *           description: Basic information about the associated startup application
 *
 *     StartupCompetitorInput:
 *       type: object
 *       required:
 *         - startupApplicationId
 *         - name
 *       properties:
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup application this competitor belongs to
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Name of the competitor
 *         website:
 *           type: string
 *           format: uri
 *           maxLength: 2048
 *           description: Website URL of the competitor
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Description of the competitor
 */

export const GET = withAuth(async (req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
