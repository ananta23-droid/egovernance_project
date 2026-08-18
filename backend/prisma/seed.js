const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/**
 * Find-or-create helper for GovernmentService (title is not @unique, so upsert won't work).
 * Uses findFirst to check existence, only creates if absent.
 */
async function upsertService(data) {
  const existing = await prisma.governmentService.findFirst({
    where: { title: data.title },
  });
  if (existing) return existing;
  return prisma.governmentService.create({ data });
}

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@sewabot.com" },
    update: {},
    create: {
      fullName: "System Admin",
      email: "admin@sewabot.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const homeDept = await prisma.department.upsert({
    where: { name: "Home Affairs Department" },
    update: {},
    create: {
      name: "Home Affairs Department",
      description: "Handles core citizen identity and travel-related public services.",
    },
  });

  const citizenshipCategory = await prisma.serviceCategory.upsert({
    where: {
      departmentId_name: {
        departmentId: homeDept.id,
        name: "Citizenship Service",
      },
    },
    update: {},
    create: {
      departmentId: homeDept.id,
      name: "Citizenship Service",
      description: "Services related to citizenship registration and certificates.",
    },
  });

  const passportCategory = await prisma.serviceCategory.upsert({
    where: {
      departmentId_name: {
        departmentId: homeDept.id,
        name: "Passport Service",
      },
    },
    update: {},
    create: {
      departmentId: homeDept.id,
      name: "Passport Service",
      description: "Passport application and renewal related services.",
    },
  });

  const licenseCategory = await prisma.serviceCategory.upsert({
    where: {
      departmentId_name: {
        departmentId: homeDept.id,
        name: "Driving License Service",
      },
    },
    update: {},
    create: {
      departmentId: homeDept.id,
      name: "Driving License Service",
      description: "Services related to driving license application and renewal.",
    },
  });

  const citizenshipService = await upsertService({
    departmentId: homeDept.id,
    categoryId: citizenshipCategory.id,
    title: "Apply for Citizenship Certificate",
    description: "Application process for obtaining Nepalese citizenship certificate.",
    eligibility: "Eligible Nepalese citizens as per prevailing law.",
    requiredDocuments: "Ward recommendation, birth proof, parent citizenship details.",
    processSteps: "Submit application at DAO -> verification -> certificate issuance.",
    feeInfo: "As per current DAO guidelines.",
    officeInfo: "District Administration Office (DAO).",
  });

  await upsertService({
    departmentId: homeDept.id,
    categoryId: passportCategory.id,
    title: "Apply for e-Passport",
    description: "Apply for a new Nepal e-passport through designated offices.",
    eligibility: "Nepalese citizens with valid citizenship document.",
    requiredDocuments: "Citizenship certificate, photos, old passport (if renewal).",
    processSteps: "Online pre-enrollment -> office visit -> biometrics -> issuance.",
    feeInfo: "Standard/express fee as published by passport department.",
    officeInfo: "Department of Passports / designated district offices.",
  });

  await upsertService({
    departmentId: homeDept.id,
    categoryId: licenseCategory.id,
    title: "Apply for Driving License",
    description: "Apply for a new driving license in Nepal.",
    eligibility: "Minimum required age and successful completion of process.",
    requiredDocuments: "Citizenship card copy, medical report, application form.",
    processSteps: "Online form -> written test -> trial -> license issuance.",
    feeInfo: "As per Transport Management Office rates.",
    officeInfo: "Department/Office of Transport Management.",
  });

  // Only create knowledge entry if none exists for this service
  const existingKb = await prisma.knowledgeBaseEntry.findFirst({
    where: { serviceId: citizenshipService.id },
  });
  if (!existingKb) {
    await prisma.knowledgeBaseEntry.create({
      data: {
        serviceId: citizenshipService.id,
        title: "Citizenship Basic Guidance",
        content:
          "Citizenship applications are processed through District Administration Office. Applicants must provide required identity and recommendation documents.",
        sourceNote: "Initial prototype curated content",
      },
    });
  }

  console.log("✅ Seed data inserted (idempotent — no duplicates created).");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });