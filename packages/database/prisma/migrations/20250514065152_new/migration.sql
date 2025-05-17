-- CreateEnum
CREATE TYPE "claimStatusType" AS ENUM ('claim_initiated', 'claim_approved', 'claim_assessed', 'claim_rejected', 'in_progress', 'submitted');

-- CreateEnum
CREATE TYPE "workOrderItemType" AS ENUM ('repair', 'replace');

-- CreateEnum
CREATE TYPE "relationshipType" AS ENUM ('self', 'spouse', 'father', 'mother', 'brother', 'sister', 'son', 'daughter', 'other');

-- CreateEnum
CREATE TYPE "policyCoverOptions" AS ENUM ('comprehensive', 'third_party', 'stand_alone', 'own_damage', 'internal_risk', 'road_transit', 'road_risk', 'third_party_with_fire_and_theft');

-- CreateEnum
CREATE TYPE "FuelTypes" AS ENUM ('petrol', 'petrol_cng', 'diesel', 'cng', 'electric');

-- CreateEnum
CREATE TYPE "NCBType" AS ENUM ('twenty', 'twenty_five', 'thirty_five', 'forty_five', 'fifty');

-- CreateEnum
CREATE TYPE "vehicleClassType" AS ENUM ('two_wheeler', 'four_wheeler');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('two_wheeler', 'private', 'commercial');

-- CreateEnum
CREATE TYPE "policyType" AS ENUM ('new', 'renew', 'rollover');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('initiator', 'approver', 'assessor', 'ic_holder', 'ro_holder', 'hub_holder', 'admin', 'generic_support');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('create', 'update', 'delete');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('system', 'member', 'api');

-- CreateEnum
CREATE TYPE "ContactRecord" AS ENUM ('person', 'company');

-- CreateEnum
CREATE TYPE "ContactStage" AS ENUM ('lead', 'qualified', 'opportunity', 'proposal', 'inNegotiation', 'lost', 'won');

-- CreateEnum
CREATE TYPE "ContactTaskStatus" AS ENUM ('open', 'completed');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('suggestion', 'problem', 'question');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'revoked');

-- CreateEnum
CREATE TYPE "WebhookTrigger" AS ENUM ('contactCreated', 'contactUpdated', 'contactDeleted');

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Account" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "description" VARCHAR(70) NOT NULL,
    "hashedKey" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ApiKey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthenticatorApp" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accountName" VARCHAR(255) NOT NULL,
    "issuer" VARCHAR(255) NOT NULL,
    "secret" VARCHAR(255) NOT NULL,
    "recoveryCodes" VARCHAR(1024) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_AuthenticatorApp" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeEmailRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ChangeEmailRequest" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "record" "ContactRecord" NOT NULL DEFAULT 'person',
    "image" VARCHAR(2048),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "address" VARCHAR(255),
    "phone" VARCHAR(32),
    "stage" "ContactStage" NOT NULL DEFAULT 'lead',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Contact" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactActivity" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "actorId" VARCHAR(255) NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_ContactActivity" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactComment" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "text" VARCHAR(2000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ContactComment" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactImage" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "data" BYTEA,
    "contentType" VARCHAR(255),
    "hash" VARCHAR(64),

    CONSTRAINT "PK_ContactImage" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactNote" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "text" VARCHAR(8000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ContactNote" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageVisit" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "userId" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_ContactPageVisit" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactTag" (
    "id" UUID NOT NULL,
    "text" VARCHAR(128) NOT NULL,

    CONSTRAINT "PK_ContactTag" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactTask" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(8000),
    "status" "ContactTaskStatus" NOT NULL DEFAULT 'open',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ContactTask" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_Favorite" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID,
    "category" "FeedbackCategory" NOT NULL DEFAULT 'suggestion',
    "message" VARCHAR(4000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Feedback" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "token" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "PK_Invitation" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL,

    CONSTRAINT "PK_Membership" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "subject" VARCHAR(128),
    "content" VARCHAR(8000) NOT NULL,
    "link" VARCHAR(2000),
    "seenAt" TIMESTAMP(3),
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Notification" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "phone" VARCHAR(32),
    "email" VARCHAR(255),
    "website" VARCHAR(2000),
    "tier" VARCHAR(255) NOT NULL DEFAULT 'free',
    "facebookPage" VARCHAR(2000),
    "instagramProfile" VARCHAR(2000),
    "linkedInProfile" VARCHAR(2000),
    "tikTokProfile" VARCHAR(2000),
    "xProfile" VARCHAR(2000),
    "youTubeChannel" VARCHAR(2000),
    "logo" VARCHAR(2048),
    "slug" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Organization" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationLogo" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "data" BYTEA,
    "contentType" VARCHAR(255),
    "hash" VARCHAR(64),

    CONSTRAINT "PK_OrganizationLogo" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordRequest" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ResetPasswordRequest" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Session" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "image" VARCHAR(2048),
    "name" VARCHAR(64) NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "password" VARCHAR(60),
    "lastLogin" TIMESTAMP(3),
    "phone" VARCHAR(32),
    "locale" VARCHAR(8) NOT NULL DEFAULT 'en-US',
    "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "enabledContactsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "enabledInboxNotifications" BOOLEAN NOT NULL DEFAULT false,
    "enabledWeeklySummary" BOOLEAN NOT NULL DEFAULT false,
    "enabledNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "enabledProductUpdates" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" UUID NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "role" "Role" NOT NULL DEFAULT 'generic_support',

    CONSTRAINT "PK_User" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "data" BYTEA,
    "contentType" VARCHAR(255),
    "hash" VARCHAR(64),

    CONSTRAINT "PK_UserImage" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "url" VARCHAR(2000) NOT NULL,
    "triggers" "WebhookTrigger"[],
    "secret" VARCHAR(1024),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Webhook" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkHours" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL DEFAULT 'sunday',

    CONSTRAINT "PK_WorkHours" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTimeSlot" (
    "id" UUID NOT NULL,
    "workHoursId" UUID NOT NULL,
    "start" TIME(0) NOT NULL,
    "end" TIME(0) NOT NULL,

    CONSTRAINT "PK_WorkTimeSlot" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IC" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ic_code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "GST" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RO" (
    "id" UUID NOT NULL,
    "icId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ro_code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "GST" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hub" (
    "id" UUID NOT NULL,
    "roId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "hub_code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "GST" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurancePolicy" (
    "id" UUID NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "policyStartDate" TIMESTAMP(3) NOT NULL,
    "policyEndDate" TIMESTAMP(3) NOT NULL,
    "Confirmation_64v" BOOLEAN NOT NULL,
    "NCB_Confirmation" BOOLEAN NOT NULL,
    "NCBType" "NCBType" NOT NULL,
    "midYearTransfer" BOOLEAN NOT NULL,
    "midYearTransferDate" TIMESTAMP(3),
    "insuredDeclaredValue" DOUBLE PRECISION NOT NULL,
    "voluntaryExcess" DOUBLE PRECISION,
    "type" "policyType" NOT NULL,
    "policyCover" "policyCoverOptions" NOT NULL,
    "breakIn" BOOLEAN NOT NULL,
    "claimHistory" BOOLEAN NOT NULL,
    "claimAmount" TEXT,
    "nilDepreciationCover" BOOLEAN NOT NULL,
    "depreciationCover" BOOLEAN NOT NULL,
    "consumablesCover" BOOLEAN NOT NULL,
    "additionalTowing" BOOLEAN NOT NULL,
    "tyreCover" BOOLEAN NOT NULL,
    "returnToInvoice" BOOLEAN NOT NULL,
    "vehicleId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "icId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurancePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT,
    "contactNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "vehicleRegistrationDate" TIMESTAMP(3) NOT NULL,
    "ManufacturedYear" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "chassisNumber" TEXT NOT NULL,
    "chassisVerified" BOOLEAN NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "engineVerified" BOOLEAN NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "cubicCapacity" INTEGER NOT NULL,
    "color" TEXT,
    "bodyType" TEXT,
    "vehicleClassType" "vehicleClassType" NOT NULL,
    "seatingCapacity" INTEGER NOT NULL,
    "hypothecated" BOOLEAN NOT NULL,
    "hypothecatedWith" TEXT,
    "RTOEndorsement" BOOLEAN NOT NULL,
    "OdometerReading" INTEGER NOT NULL,
    "fuelUsage" "FuelTypes" NOT NULL,
    "taxPaid" INTEGER NOT NULL,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" UUID NOT NULL,
    "vehicleParked" BOOLEAN NOT NULL,
    "relationWithOwner" TEXT,
    "name" TEXT,
    "address" TEXT,
    "contactNumber" TEXT,
    "licenseNumber" TEXT,
    "licenseType" TEXT,
    "driverDOB" TIMESTAMP(3),
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "MDLAuthority" TEXT,
    "DLEndorsement" TEXT,
    "drivingAllowed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LossAndSurveyDetails" (
    "id" UUID NOT NULL,
    "accidentDate" TIMESTAMP(3) NOT NULL,
    "intimationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surveyAllotmentDate" TIMESTAMP(3) NOT NULL,
    "surveyDate" TIMESTAMP(3) NOT NULL,
    "lossDescription" TEXT NOT NULL,
    "lossNature" TEXT NOT NULL,
    "observation" TEXT,
    "thirdPartyLoss" BOOLEAN NOT NULL,
    "policeComplaintNo" TEXT,
    "policeComplaintDetails" TEXT,
    "claimId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LossAndSurveyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "driverId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" UUID NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "internalClaimNumber" TEXT,
    "hubId" UUID,
    "incidentId" UUID,
    "workshopId" UUID,
    "organizationId" UUID NOT NULL,
    "insurancePolicyId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" UUID NOT NULL,
    "billId" UUID,
    "workshopId" UUID,
    "claimId" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimStatus" (
    "id" UUID NOT NULL,
    "status" "claimStatusType" NOT NULL,
    "claimId" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "repairOrReplace" "workOrderItemType" NOT NULL,
    "labourCharges" DOUBLE PRECISION NOT NULL,
    "paintCharges" DOUBLE PRECISION NOT NULL,
    "isAllowed" BOOLEAN NOT NULL DEFAULT true,
    "workOrderId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillToIC" (
    "id" UUID NOT NULL,
    "billId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillToIC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillItems" (
    "id" UUID NOT NULL,
    "billId" UUID NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "claimId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactToContactTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ContactToContactTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClaimToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ClaimToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "IX_Account_userId" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON "ApiKey"("hashedKey");

-- CreateIndex
CREATE INDEX "IX_ApiKey_organizationId" ON "ApiKey"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticatorApp_userId_key" ON "AuthenticatorApp"("userId");

-- CreateIndex
CREATE INDEX "IX_AuthenticatorApp_userId" ON "AuthenticatorApp"("userId");

-- CreateIndex
CREATE INDEX "IX_ChangeEmailRequest_userId" ON "ChangeEmailRequest"("userId");

-- CreateIndex
CREATE INDEX "IX_Contact_organizationId" ON "Contact"("organizationId");

-- CreateIndex
CREATE INDEX "IX_ContactActivity_contactId" ON "ContactActivity"("contactId");

-- CreateIndex
CREATE INDEX "IX_ContactActivity_occurredAt" ON "ContactActivity"("occurredAt");

-- CreateIndex
CREATE INDEX "IX_ContactComment_contactId" ON "ContactComment"("contactId");

-- CreateIndex
CREATE INDEX "IX_ContactComment_userId" ON "ContactComment"("userId");

-- CreateIndex
CREATE INDEX "IX_ContactImage_contactId" ON "ContactImage"("contactId");

-- CreateIndex
CREATE INDEX "IX_ContactNote_contactId" ON "ContactNote"("contactId");

-- CreateIndex
CREATE INDEX "IX_ContactNote_userId" ON "ContactNote"("userId");

-- CreateIndex
CREATE INDEX "IX_ContactPageVisit_contactId" ON "ContactPageVisit"("contactId");

-- CreateIndex
CREATE INDEX "IX_ContactPageVisit_userId" ON "ContactPageVisit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactTag_text_key" ON "ContactTag"("text");

-- CreateIndex
CREATE INDEX "IX_ContactTask_contactId" ON "ContactTask"("contactId");

-- CreateIndex
CREATE INDEX "IX_Favorite_userId" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "IX_Favorite_contactId" ON "Favorite"("contactId");

-- CreateIndex
CREATE INDEX "IX_Feedback_organizationId" ON "Feedback"("organizationId");

-- CreateIndex
CREATE INDEX "IX_Feedback_userId" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "IX_Invitation_organizationId" ON "Invitation"("organizationId");

-- CreateIndex
CREATE INDEX "IX_Invitation_token" ON "Invitation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_organizationId_userId_key" ON "Membership"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "IX_Notification_userId" ON "Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "IX_Organization_stripeCustomerId" ON "Organization"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "IX_OrganizationLogo_organizationId" ON "OrganizationLogo"("organizationId");

-- CreateIndex
CREATE INDEX "IX_ResetPasswordRequest_email" ON "ResetPasswordRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "IX_Session_userId" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "IX_UserImage_userId" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "IX_Webhook_organizationId" ON "Webhook"("organizationId");

-- CreateIndex
CREATE INDEX "IX_WorkHours_organizationId" ON "WorkHours"("organizationId");

-- CreateIndex
CREATE INDEX "IX_WorkTimeSlot_workHoursId" ON "WorkTimeSlot"("workHoursId");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePolicy_vehicleId_key" ON "InsurancePolicy"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePolicy_ownerId_key" ON "InsurancePolicy"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_ownerId_key" ON "Vehicle"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "LossAndSurveyDetails_claimId_key" ON "LossAndSurveyDetails"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_claimNumber_key" ON "Claim"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_internalClaimNumber_key" ON "Claim"("internalClaimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_claimId_key" ON "WorkOrder"("claimId");

-- CreateIndex
CREATE INDEX "WorkOrder_billId_idx" ON "WorkOrder"("billId");

-- CreateIndex
CREATE INDEX "WorkOrder_workshopId_idx" ON "WorkOrder"("workshopId");

-- CreateIndex
CREATE INDEX "WorkOrder_claimId_idx" ON "WorkOrder"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimStatus_claimId_key" ON "ClaimStatus"("claimId");

-- CreateIndex
CREATE INDEX "Item_workOrderId_idx" ON "Item"("workOrderId");

-- CreateIndex
CREATE INDEX "BillItems_billId_idx" ON "BillItems"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_fileName_key" ON "Image"("fileName");

-- CreateIndex
CREATE INDEX "_ContactToContactTag_B_index" ON "_ContactToContactTag"("B");

-- CreateIndex
CREATE INDEX "_ClaimToUser_B_index" ON "_ClaimToUser"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthenticatorApp" ADD CONSTRAINT "AuthenticatorApp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEmailRequest" ADD CONSTRAINT "ChangeEmailRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactActivity" ADD CONSTRAINT "ContactActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactComment" ADD CONSTRAINT "ContactComment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactComment" ADD CONSTRAINT "ContactComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactNote" ADD CONSTRAINT "ContactNote_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactNote" ADD CONSTRAINT "ContactNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPageVisit" ADD CONSTRAINT "ContactPageVisit_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPageVisit" ADD CONSTRAINT "ContactPageVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTask" ADD CONSTRAINT "ContactTask_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkHours" ADD CONSTRAINT "WorkHours_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkTimeSlot" ADD CONSTRAINT "WorkTimeSlot_workHoursId_fkey" FOREIGN KEY ("workHoursId") REFERENCES "WorkHours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IC" ADD CONSTRAINT "IC_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RO" ADD CONSTRAINT "RO_icId_fkey" FOREIGN KEY ("icId") REFERENCES "IC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hub" ADD CONSTRAINT "Hub_roId_fkey" FOREIGN KEY ("roId") REFERENCES "RO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurancePolicy" ADD CONSTRAINT "InsurancePolicy_icId_fkey" FOREIGN KEY ("icId") REFERENCES "IC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurancePolicy" ADD CONSTRAINT "InsurancePolicy_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurancePolicy" ADD CONSTRAINT "InsurancePolicy_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LossAndSurveyDetails" ADD CONSTRAINT "LossAndSurveyDetails_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_insurancePolicyId_fkey" FOREIGN KEY ("insurancePolicyId") REFERENCES "InsurancePolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimStatus" ADD CONSTRAINT "ClaimStatus_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimStatus" ADD CONSTRAINT "ClaimStatus_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillToIC" ADD CONSTRAINT "BillToIC_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillToIC" ADD CONSTRAINT "BillToIC_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillItems" ADD CONSTRAINT "BillItems_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToContactTag" ADD CONSTRAINT "_ContactToContactTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToContactTag" ADD CONSTRAINT "_ContactToContactTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ContactTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToUser" ADD CONSTRAINT "_ClaimToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToUser" ADD CONSTRAINT "_ClaimToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
