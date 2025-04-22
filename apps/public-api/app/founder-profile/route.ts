import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     FounderProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         startupId:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         designation:
 *           type: string
 *         linkedinUrl:
 *           type: string
 *         twitterUrl:
 *           type: string
 *         bio:
 *           type: string
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field:
 *                 type: string
 *               startYear:
 *                 type: integer
 *               endYear:
 *                 type: integer
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               role:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - userId
 *         - startupId
 *         - firstName
 *         - lastName
 *         - email
 *         - designation
 *
 *     FounderProfileInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         startupId:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         designation:
 *           type: string
 *         linkedinUrl:
 *           type: string
 *         twitterUrl:
 *           type: string
 *         bio:
 *           type: string
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field:
 *                 type: string
 *               startYear:
 *                 type: integer
 *               endYear:
 *                 type: integer
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               role:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *       required:
 *         - userId
 *         - startupId
 *         - firstName
 *         - lastName
 *         - email
 *         - designation
 */

/**
 * @swagger
 * /user/founder-profile:
 *   get:
 *     summary: Get all founder profiles
 *     description: Retrieve a list of founder profiles with optional filtering and pagination
 *     tags: [FounderProfile]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - name: userId
 *         in: query
 *         description: Filter by user ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: startupId
 *         in: query
 *         description: Filter by startup ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: search
 *         in: query
 *         description: Search term to filter profiles
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved founder profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FounderProfile'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new founder profile
 *     description: Create a new founder profile with the provided data
 *     tags: [FounderProfile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FounderProfileInput'
 *     responses:
 *       201:
 *         description: Founder profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FounderProfile'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /user/founder-profile/{id}:
 *   get:
 *     summary: Get a founder profile by ID
 *     description: Retrieve a specific founder profile by its ID
 *     tags: [FounderProfile]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the founder profile
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved founder profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FounderProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Founder profile not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a founder profile
 *     description: Update an existing founder profile by its ID
 *     tags: [FounderProfile]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the founder profile
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FounderProfileInput'
 *     responses:
 *       200:
 *         description: Founder profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FounderProfile'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Founder profile not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a founder profile
 *     description: Delete a founder profile by its ID
 *     tags: [FounderProfile]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the founder profile
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Founder profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Founder profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Founder profile not found
 *       500:
 *         description: Internal server error
 */

export const GET = withAuth(async (req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
