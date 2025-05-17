import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { handleError } from './helper/errorHandler.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import claimRoutes from './routes/claim.routes.js';
import authRoutes from './routes/auth.route.js';
import icRoutes from './routes/ic.routes.js';
import roRoutes from './routes/ro.routes.js';
import hubRoutes from './routes/hub.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import insurancePolicyRoutes from './routes/insurancePolicy.routes.js';
import driverRoutes from './routes/driver.routes.js';
import lossAndSurveyDetailsRoutes from './routes/lossAndSurveyDetails.routes.js';
import workshopRoutes from './routes/workshop.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import workOrderRoutes from './routes/workOrder.routes.js';
import claimStatusRoutes from './routes/claimStatus.routes.js';
import itemRoutes from './routes/item.routes.js';
import billRoutes from './routes/bill.routes.js';
import billItemsRoutes from './routes/billItems.routes.js';
import organizationRoutes from './routes/organization.routes.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const { errorHandler } = handleError;
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ics', icRoutes);
app.use('/api/ros', roRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/insurance-policies', insurancePolicyRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/loss-and-survey-details', lossAndSurveyDetailsRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/claim-statuses', claimStatusRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/bill-items', billItemsRoutes);
app.use('/api/organizations', organizationRoutes);

// Error Handling
app.use(errorHandler);

async function main() {
  const claim = await prisma.workshop.findMany();
  console.log(claim);
}

main();

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
