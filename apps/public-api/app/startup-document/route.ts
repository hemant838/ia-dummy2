import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * /startup/{startupId}/document:
 *   get:
 *     summary: Get all startup documents
 *     description: Returns a paginated list of startup documents with optional filtering and search
 *     tags:
 *       - Startup Documents
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
 *         name: documentType
 *         schema:
 *           type: string
 *           enum: [INVESTMENT_NOTE, PITCH_DECK, ONE_PAGER, TERM_SHEET, MANDATE_LETTER, OTHER]
 *         description: Filter by document type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in document names and descriptions
 *     responses:
 *       200:
 *         description: List of startup documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StartupDocument'
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
 *     summary: Create a new startup document
 *     description: Create a new startup document with the provided data
 *     tags:
 *       - Startup Documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupDocumentInput'
 *     responses:
 *       201:
 *         description: Startup document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupDocument'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /startup/{startupId}/document/{id}:
 *   get:
 *     summary: Get startup document by ID
 *     description: Returns detailed information about a specific startup document
 *     tags:
 *       - Startup Documents
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
 *         description: ID of the startup document
 *     responses:
 *       200:
 *         description: Startup document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupDocument'
 *       404:
 *         description: Startup document not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update startup document
 *     description: Update an existing startup document by its ID
 *     tags:
 *       - Startup Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupDocumentInput'
 *     responses:
 *       200:
 *         description: Startup document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupDocument'
 *       404:
 *         description: Startup document not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete startup document
 *     description: Delete a startup document by its ID
 *     tags:
 *       - Startup Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup document
 *     responses:
 *       200:
 *         description: Startup document deleted successfully
 *       404:
 *         description: Startup document not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     StartupDocument:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the startup document
 *         startupId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup this document belongs to
 *         documentType:
 *           type: string
 *           enum: [INVESTMENT_NOTE, PITCH_DECK, ONE_PAGER, TERM_SHEET, MANDATE_LETTER, OTHER]
 *           description: Type of the document
 *         name:
 *           type: string
 *           description: Name of the document
 *         description:
 *           type: string
 *           description: Description of the document
 *         fileUrl:
 *           type: string
 *           format: uri
 *           description: URL where the document file is stored
 *         startup:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *           description: Basic information about the associated startup
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the document was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the document was last updated
 *
 *     StartupDocumentInput:
 *       type: object
 *       required:
 *         - startupId
 *         - documentType
 *         - name
 *         - fileUrl
 *       properties:
 *         startupId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup this document belongs to
 *         documentType:
 *           type: string
 *           enum: [INVESTMENT_NOTE, PITCH_DECK, ONE_PAGER, TERM_SHEET, MANDATE_LETTER, OTHER]
 *           description: Type of the document
 *         name:
 *           type: string
 *           description: Name of the document
 *         description:
 *           type: string
 *           description: Description of the document
 *         fileUrl:
 *           type: string
 *           format: uri
 *           description: URL where the document file is stored
 */

export const GET = withAuth(async (req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
