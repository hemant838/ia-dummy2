import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * /startup-application/{applicationId}/note:
 *   get:
 *     summary: Get all startup notes
 *     description: Returns a paginated list of startup notes with optional filtering and search
 *     tags:
 *       - Startup Notes
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
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in note content
 *     responses:
 *       200:
 *         description: List of startup notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StartupNote'
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
 *     summary: Create a new startup note
 *     description: Create a new startup note with the provided data
 *     tags:
 *       - Startup Notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupNoteInput'
 *     responses:
 *       201:
 *         description: Startup note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupNote'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /startup-application/{applicationId}/note/{id}:
 *   get:
 *     summary: Get startup note by ID
 *     description: Returns detailed information about a specific startup note
 *     tags:
 *       - Startup Notes
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
 *         description: ID of the startup note
 *     responses:
 *       200:
 *         description: Startup note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupNote'
 *       404:
 *         description: Startup note not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update startup note
 *     description: Update an existing startup note by its ID
 *     tags:
 *       - Startup Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupNoteInput'
 *     responses:
 *       200:
 *         description: Startup note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupNote'
 *       404:
 *         description: Startup note not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete startup note
 *     description: Delete a startup note by its ID
 *     tags:
 *       - Startup Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup note
 *     responses:
 *       200:
 *         description: Startup note deleted successfully
 *       404:
 *         description: Startup note not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     StartupNote:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the startup note
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup application this note belongs to
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the note
 *         content:
 *           type: string
 *           maxLength: 5000
 *           description: Content of the note
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
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *             email:
 *               type: string
 *           description: Information about the user who created the note
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the note was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the note was last updated
 *
 *     StartupNoteInput:
 *       type: object
 *       required:
 *         - startupApplicationId
 *         - userId
 *         - content
 *       properties:
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup application this note belongs to
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user creating the note
 *         content:
 *           type: string
 *           maxLength: 5000
 *           description: Content of the note
 */

export const GET = withAuth(async (req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
