const fallbackDepartments = [
  {
    id: 1,
    name: "Home Affairs Department",
    description: "Handles core citizen identity and travel-related public services.",
  },
];

const fallbackCategories = [
  {
    id: 1,
    departmentId: 1,
    name: "Citizenship Service",
    description: "Services related to citizenship registration and certificates.",
  },
  {
    id: 2,
    departmentId: 1,
    name: "Passport Service",
    description: "Passport application and renewal related services.",
  },
  {
    id: 3,
    departmentId: 1,
    name: "Driving License Service",
    description: "Services related to driving license application and renewal.",
  },
];

const fallbackServices = [
  {
    id: 1,
    departmentId: 1,
    categoryId: 1,
    title: "Apply for Citizenship Certificate",
    description: "Application process for obtaining Nepalese citizenship certificate.",
    eligibility: "Eligible Nepalese citizens as per prevailing law.",
    requiredDocuments: "Ward recommendation, birth proof, parent citizenship details.",
    processSteps: "Submit application at DAO -> verification -> certificate issuance.",
    feeInfo: "As per current DAO guidelines.",
    officeInfo: "District Administration Office (DAO).",
    isActive: true,
  },
  {
    id: 2,
    departmentId: 1,
    categoryId: 2,
    title: "Apply for e-Passport",
    description: "Apply for a new Nepal e-passport through designated offices.",
    eligibility: "Nepalese citizens with valid citizenship document.",
    requiredDocuments: "Citizenship certificate, photos, old passport (if renewal).",
    processSteps: "Online pre-enrollment -> office visit -> biometrics -> issuance.",
    feeInfo: "Standard/express fee as published by passport department.",
    officeInfo: "Department of Passports / designated district offices.",
    isActive: true,
  },
  {
    id: 3,
    departmentId: 1,
    categoryId: 3,
    title: "Apply for Driving License",
    description: "Apply for a new driving license in Nepal.",
    eligibility: "Minimum required age and successful completion of process.",
    requiredDocuments: "Citizenship card copy, medical report, application form.",
    processSteps: "Online form -> written test -> trial -> license issuance.",
    feeInfo: "As per Transport Management Office rates.",
    officeInfo: "Department/Office of Transport Management.",
    isActive: true,
  },
];

const enrichService = (service) => ({
  ...service,
  department: fallbackDepartments.find((d) => d.id === service.departmentId) || null,
  category: fallbackCategories.find((c) => c.id === service.categoryId) || null,
});

const filterServices = ({ search, departmentId, categoryId, includeInactive = false }) => {
  const depId = departmentId ? Number(departmentId) : null;
  const catId = categoryId ? Number(categoryId) : null;
  const includeInactiveFlag = String(includeInactive) === "true";

  return fallbackServices
    .filter((s) => (includeInactiveFlag ? true : s.isActive))
    .filter((s) => (depId ? s.departmentId === depId : true))
    .filter((s) => (catId ? s.categoryId === catId : true))
    .filter((s) => {
      if (!search) return true;
      const q = String(search).toLowerCase();
      return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    })
    .map(enrichService);
};

const getFallbackServices = ({ search, departmentId, categoryId, page = 1, limit = 10, includeInactive = false }) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const filtered = filterServices({ search, departmentId, categoryId, includeInactive });
  const items = filtered.slice(skip, skip + limitNum);
  const total = filtered.length;

  return {
    items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

const getFallbackServiceById = (id) => {
  const service = fallbackServices.find((s) => s.id === Number(id));
  return service ? enrichService(service) : null;
};

const getFallbackDepartments = () => fallbackDepartments;

const getFallbackCategories = (departmentId) => {
  const depId = departmentId ? Number(departmentId) : null;
  return depId
    ? fallbackCategories.filter((c) => c.departmentId === depId)
    : fallbackCategories;
};

module.exports = {
  getFallbackServices,
  getFallbackServiceById,
  getFallbackDepartments,
  getFallbackCategories,
};
