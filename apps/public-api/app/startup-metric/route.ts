import { NextRequest } from 'next/server';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * /startup-application/{applicationId}/metric:
 *   get:
 *     summary: Get all startup metrics
 *     description: Returns a paginated list of startup metrics with optional filtering
 *     tags:
 *       - Startup Metrics
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
 *         name: metricType
 *         schema:
 *           type: string
 *           enum: [MRR, ARR, PROFIT, EBITDA, BURN]
 *         description: Filter by metric type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter metrics from this date (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter metrics until this date (inclusive)
 *     responses:
 *       200:
 *         description: List of startup metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StartupMetric'
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
 *     summary: Create a new startup metric
 *     description: Create a new startup metric with the provided data
 *     tags:
 *       - Startup Metrics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupMetricInput'
 *     responses:
 *       201:
 *         description: Startup metric created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupMetric'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /startup-application/{applicationId}/metric/{id}:
 *   get:
 *     summary: Get startup metric by ID
 *     description: Returns detailed information about a specific startup metric
 *     tags:
 *       - Startup Metrics
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
 *         description: ID of the startup metric
 *     responses:
 *       200:
 *         description: Startup metric retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupMetric'
 *       404:
 *         description: Startup metric not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update startup metric
 *     description: Update an existing startup metric by its ID
 *     tags:
 *       - Startup Metrics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup metric
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartupMetricInput'
 *     responses:
 *       200:
 *         description: Startup metric updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartupMetric'
 *       404:
 *         description: Startup metric not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete startup metric
 *     description: Delete a startup metric by its ID
 *     tags:
 *       - Startup Metrics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the startup metric
 *     responses:
 *       200:
 *         description: Startup metric deleted successfully
 *       404:
 *         description: Startup metric not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     StartupMetric:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the startup metric
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup application this metric belongs to
 *         metricType:
 *           type: string
 *           enum: [MRR, ARR, PROFIT, EBITDA, BURN]
 *           description: Type of the metric
 *         value:
 *           type: number
 *           format: decimal
 *           description: Value of the metric
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the metric was recorded
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
 *     StartupMetricInput:
 *       type: object
 *       required:
 *         - startupApplicationId
 *         - metricType
 *         - value
 *         - date
 *       properties:
 *         startupApplicationId:
 *           type: string
 *           format: uuid
 *           description: ID of the startup application this metric belongs to
 *         metricType:
 *           type: string
 *           enum: [MRR, ARR, PROFIT, EBITDA, BURN]
 *           description: Type of the metric
 *         value:
 *           type: number
 *           format: decimal
 *           description: Value of the metric
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the metric was recorded
 */

export const GET = withAuth(async (req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
});
