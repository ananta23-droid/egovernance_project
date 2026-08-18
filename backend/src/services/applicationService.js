const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const isPrismaConnectionError = require("../utils/isPrismaConnectionError");

// In-memory fallback array if database connection fails
const memoryApplications = [
  {
    id: 1,
    applicationNumber: "EP-2026-000123",
    userId: 1,
    serviceId: 2,
    status: "UNDER_REVIEW",
    applicantName: "Ram Bahadur Thapa",
    applicantEmail: "ramthapa@example.com",
    applicantPhone: "9841234567",
    formData: {
      fullName: "Ram Bahadur Thapa",
      nepaliName: "राम बहादुर थापा",
      dob: "1998-05-15",
      gender: "Male",
      citizenshipNumber: "27-01-75-12345",
      nationality: "Nepali",
      fatherName: "Hari Bahadur Thapa",
      motherName: "Sita Thapa",
      grandfatherName: "Bhim Bahadur Thapa",
      permanentAddress: "Kathmandu-10, Baneshwor",
      district: "Kathmandu",
      municipality: "Kathmandu Metropolitan City",
      ward: "10",
      applicationType: "New",
      passportType: "Ordinary (34 Pages)",
      applicationPriority: "Standard",
      preferredLocation: "Department of Passports, Tripureshwor, Kathmandu",
      preferredDate: "2026-08-20",
      preferredTime: "10:30 AM",
    },
    documents: [
      { name: "Citizenship Certificate", required: true, uploaded: true, fileName: "citizenship_front_back.pdf" },
      { name: "Passport Photo", required: true, uploaded: true, fileName: "pp_photo.jpg" },
    ],
    appointment: {
      location: "Department of Passports, Tripureshwor, Kathmandu",
      date: "2026-08-20",
      time: "10:30 AM",
    },
    statusHistory: [
      { status: "SUBMITTED", date: "2026-08-08T10:00:00.000Z", note: "Application successfully submitted online." },
      { status: "UNDER_REVIEW", date: "2026-08-09T09:30:00.000Z", note: "Pre-enrollment details under verification at Department of Passports." },
    ],
    submittedAt: "2026-08-08T10:00:00.000Z",
    updatedAt: "2026-08-09T09:30:00.000Z",
    service: { id: 2, title: "Apply for e-Passport" },
  },
  {
    id: 2,
    applicationNumber: "DL-2026-000087",
    userId: 1,
    serviceId: 3,
    status: "SUBMITTED",
    applicantName: "Ram Bahadur Thapa",
    applicantEmail: "ramthapa@example.com",
    applicantPhone: "9841234567",
    formData: {
      fullName: "Ram Bahadur Thapa",
      citizenshipNumber: "27-01-75-12345",
      applicationType: "New License (Category B - Car)",
    },
    documents: [
      { name: "Citizenship Certificate", required: true, uploaded: true, fileName: "citizenship.pdf" },
      { name: "Medical Report", required: true, uploaded: true, fileName: "medical_report.pdf" },
    ],
    appointment: {
      location: "Transport Management Office, Ekantakuna, Lalitpur",
      date: "2026-08-25",
      time: "11:00 AM",
    },
    statusHistory: [
      { status: "SUBMITTED", date: "2026-08-07T14:20:00.000Z", note: "Driving License application submitted." },
    ],
    submittedAt: "2026-08-07T14:20:00.000Z",
    updatedAt: "2026-08-07T14:20:00.000Z",
    service: { id: 3, title: "Apply for Driving License" },
  },
];

let counter = 124;

const generateApplicationNumber = (serviceId) => {
  const year = new Date().getFullYear();
  let prefix = "GA";
  if (Number(serviceId) === 2) prefix = "EP"; // e-Passport
  else if (Number(serviceId) === 1) prefix = "CS"; // Citizenship
  else if (Number(serviceId) === 3) prefix = "DL"; // Driving License

  const num = String(counter++).padStart(6, "0");
  return `${prefix}-${year}-${num}`;
};

const createApplication = async (payload, userId = null) => {
  const { serviceId, formData, documents, appointment } = payload;

  if (!serviceId || !formData) {
    throw new ApiError(400, "Service ID and form data are required.");
  }

  const applicationNumber = generateApplicationNumber(serviceId);
  const now = new Date().toISOString();

  const applicantName = formData.fullName || "Citizen Applicant";
  const applicantEmail = formData.email || null;
  const applicantPhone = formData.phoneNumber || formData.phone || null;

  const statusHistory = [
    {
      status: "SUBMITTED",
      date: now,
      note: "Application successfully submitted to SewaBot e-Governance portal.",
    },
    {
      status: "UNDER_REVIEW",
      date: new Date(Date.now() + 86400000).toISOString(),
      note: "Scheduled for automated document and eligibility verification.",
    },
  ];

  try {
    const created = await prisma.serviceApplication.create({
      data: {
        applicationNumber,
        userId: userId ? Number(userId) : null,
        serviceId: Number(serviceId),
        status: "SUBMITTED",
        applicantName,
        applicantEmail,
        applicantPhone,
        formData: formData || {},
        documents: documents || [],
        appointment: appointment || null,
        statusHistory,
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    return created;
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;

    // Fallback to memory
    const memItem = {
      id: memoryApplications.length + 1,
      applicationNumber,
      userId: userId ? Number(userId) : null,
      serviceId: Number(serviceId),
      status: "SUBMITTED",
      applicantName,
      applicantEmail,
      applicantPhone,
      formData: formData || {},
      documents: documents || [],
      appointment: appointment || null,
      statusHistory,
      submittedAt: now,
      updatedAt: now,
      service: { id: Number(serviceId), title: "Government Service" },
    };
    memoryApplications.unshift(memItem);
    return memItem;
  }
};

const trackApplication = async (appNumber) => {
  const cleanAppNum = String(appNumber || "").trim().toUpperCase();

  try {
    const found = await prisma.serviceApplication.findFirst({
      where: {
        applicationNumber: {
          equals: cleanAppNum,
          mode: "insensitive",
        },
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            department: { select: { name: true } },
            category: { select: { name: true } },
          },
        },
      },
    });

    if (found) return found;
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
  }

  // Check fallback memory
  const memFound = memoryApplications.find(
    (a) => a.applicationNumber.toUpperCase() === cleanAppNum
  );

  if (!memFound) {
    throw new ApiError(404, `No application found with ID: ${cleanAppNum}`);
  }

  return memFound;
};

const getApplicationsByUser = async (userId, userEmail) => {
  try {
    const where = {};
    if (userId) where.userId = Number(userId);
    else if (userEmail) where.applicantEmail = userEmail;
    else return [];

    const items = await prisma.serviceApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    return items;
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;

    return memoryApplications.filter((a) => {
      if (userId && String(a.userId) === String(userId)) return true;
      if (userEmail && a.applicantEmail === userEmail) return true;
      return false;
    });
  }
};

const getApplicationById = async (id) => {
  try {
    const found = await prisma.serviceApplication.findUnique({
      where: { id: Number(id) },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    if (found) return found;
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
  }

  const memFound = memoryApplications.find((a) => a.id === Number(id));
  if (!memFound) {
    throw new ApiError(404, "Application not found.");
  }
  return memFound;
};

module.exports = {
  createApplication,
  trackApplication,
  getApplicationsByUser,
  getApplicationById,
};
