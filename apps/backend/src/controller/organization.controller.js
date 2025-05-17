import { PrismaClient } from '@prisma/client';
import { handleError } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();
const { asyncHandler, NotFoundError, BadRequestError, success, HTTP_STATUS } = handleError;
const { getPagination, buildPaginationMetadata } = pagination;

// Get all organizations with pagination
export const getAllOrganizations = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  
  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      skip,
      take,
      orderBy: { 
        updatedAt: 'desc' 
      }
    }),
    prisma.organization.count()
  ]);

  const paginationMeta = buildPaginationMetadata(page, limit, total);
  
  return success(req, res, { organizations, pagination: paginationMeta }, 'Organizations retrieved successfully');
});

// Get organization by ID
export const getOrganizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const organization = await prisma.organization.findUnique({
    where: { id }
  });
  
  if (!organization) {
    throw new NotFoundError('Organization not found');
  }
  
  return success(req, res, organization, 'Organization retrieved successfully');
});

// Create organization
export const createOrganization = asyncHandler(async (req, res) => {
  const { name, address, phone, email, website, tier, slug, stripeCustomerId } = req.body;
  
  // Check if slug is already taken
  const existingOrganization = await prisma.organization.findUnique({
    where: { slug }
  });
  
  if (existingOrganization) {
    throw new BadRequestError('Organization with this slug already exists');
  }
  
  const organization = await prisma.organization.create({
    data: {
      name,
      address,
      phone,
      email,
      website,
      tier: tier || 'free',
      slug,
      stripeCustomerId: stripeCustomerId || ''
    }
  });
  
  return success(req, res, organization, 'Organization created successfully', HTTP_STATUS.CREATED);
});

// Update organization by ID
export const updateOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    phone,
    email,
    website,
    tier,
    facebookPage,
    instagramProfile,
    linkedInProfile,
    tikTokProfile,
    xProfile,
    youTubeChannel,
    logo
  } = req.body;
  
  // Check if organization exists
  const organizationExists = await prisma.organization.findUnique({
    where: { id }
  });
  
  if (!organizationExists) {
    throw new NotFoundError('Organization not found');
  }
  
  // Check if slug is present and unique
  if (req.body.slug && req.body.slug !== organizationExists.slug) {
    const slugExists = await prisma.organization.findUnique({
      where: { slug: req.body.slug }
    });
    
    if (slugExists) {
      throw new BadRequestError('Organization with this slug already exists');
    }
  }
  
  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(website !== undefined && { website }),
      ...(tier && { tier }),
      ...(req.body.slug && { slug: req.body.slug }),
      ...(facebookPage !== undefined && { facebookPage }),
      ...(instagramProfile !== undefined && { instagramProfile }),
      ...(linkedInProfile !== undefined && { linkedInProfile }),
      ...(tikTokProfile !== undefined && { tikTokProfile }),
      ...(xProfile !== undefined && { xProfile }),
      ...(youTubeChannel !== undefined && { youTubeChannel }),
      ...(logo !== undefined && { logo })
    }
  });
  
  return success(req, res, updatedOrganization, 'Organization updated successfully');
});

// Delete organization by ID
export const deleteOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if organization exists
  const organizationExists = await prisma.organization.findUnique({
    where: { id }
  });
  
  if (!organizationExists) {
    throw new NotFoundError('Organization not found');
  }
  
  await prisma.organization.delete({
    where: { id }
  });
  
  return success(req, res, null, 'Organization deleted successfully');
});

// Get organization members
export const getOrganizationMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { skip, take, page, limit } = getPagination(req.query);
  
  // Check if organization exists
  const organizationExists = await prisma.organization.findUnique({
    where: { id }
  });
  
  if (!organizationExists) {
    throw new NotFoundError('Organization not found');
  }
  
  const [members, total] = await Promise.all([
    prisma.membership.findMany({
      skip,
      take,
      where: { organizationId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.membership.count({
      where: { organizationId: id }
    })
  ]);
  
  const paginationMeta = buildPaginationMetadata(page, limit, total);
  
  return success(req, res, { members, pagination: paginationMeta }, 'Organization members retrieved successfully');
});

export const organizationController = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers
}; 