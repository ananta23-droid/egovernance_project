import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getServiceById } from "../../api/serviceApi";
import { submitApplication } from "../../api/applicationApi";
import { getUser } from "../../utils/authStorage";

// Predefined service configurations
const SERVICE_CONFIGS = {
  2: {
    // e-Passport
    code: "EP",
    name: "e-Passport Application",
    documents: [
      { id: "citizenship", name: "Citizenship Certificate", required: true, description: "Clear scanned copy of front and back of your citizenship certificate." },
      { id: "photo", name: "Passport-size Photo", required: true, description: "Recent photo with white background (35mm x 45mm)." },
      { id: "old_passport", name: "Old Passport", required: false, description: "Required for renewal applications only." },
    ],
  },
  1: {
    // Citizenship Certificate
    code: "CS",
    name: "Citizenship Certificate Application",
    documents: [
      { id: "ward_rec", name: "Ward Recommendation Letter", required: true, description: "Official recommendation letter issued by your Ward Office." },
      { id: "birth_cert", name: "Birth Certificate", required: true, description: "Government issued birth registration certificate." },
      { id: "parents_citizenship", name: "Parents' Citizenship Certificate", required: true, description: "Copies of Father and Mother's citizenship certificates." },
    ],
  },
  3: {
    // Driving License
    code: "DL",
    name: "Driving License Application",
    documents: [
      { id: "citizenship", name: "Citizenship Certificate", required: true, description: "Clear copy of citizenship certificate." },
      { id: "medical_report", name: "Medical Fitness Report", required: true, description: "Medical report certified by a recognized doctor/clinic." },
    ],
  },
};

const STEPS = [
  { num: 1, name: "Eligibility" },
  { num: 2, name: "Personal Details" },
  { num: 3, name: "Service Details" },
  { num: 4, name: "Documents" },
  { num: 5, name: "Review" },
  { num: 6, name: "Submitted" },
];

const ApplicationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [eligibility, setEligibility] = useState({
    isCitizen: "yes",
    hasCitizenship: "yes",
    applicationType: "new",
    hasRequiredDocs: "yes",
  });

  const [personal, setPersonal] = useState({
    fullName: currentUser?.fullName || "Ram Bahadur Demo",
    nepaliName: "राम बहादुर थापा (डेमो)",
    dob: "2000-01-01",
    gender: "Male",
    citizenshipNumber: "DEMO-CIT-000001",
    nationality: "Nepali",
    fatherName: "Hari Bahadur Demo",
    motherName: "Sita Thapa Demo",
    grandfatherName: "Krishna Bahadur Demo",
    permanentAddress: "Kathmandu, Nepal — Demo Address",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    ward: "10",
    phoneNumber: "9800000000",
    email: currentUser?.email || "demo@example.com",
  });

  const [serviceDetails, setServiceDetails] = useState({
    applicationType: "New",
    passportType: "Ordinary (34 Pages)",
    applicationPriority: "Standard",
    preferredLocation: "Department of Passports, Tripureshwor, Kathmandu",
    preferredDate: "2026-09-01",
    preferredTime: "10:00 AM",
    // Driving License / Citizenship specific fields
    licenseCategory: "B (Car / Jeep / Delivery Van)",
    bloodGroup: "A+",
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    citizenship: { fileName: "demo-citizenship-certificate.pdf", fileSize: "1.2 MB", uploadedAt: "Demo Document" },
    photo: { fileName: "demo-passport-photo.jpg", fileSize: "450 KB", uploadedAt: "Demo Document" },
    ward_rec: { fileName: "demo-ward-recommendation.pdf", fileSize: "850 KB", uploadedAt: "Demo Document" },
    birth_cert: { fileName: "demo-birth-certificate.pdf", fileSize: "1.1 MB", uploadedAt: "Demo Document" },
    parents_citizenship: { fileName: "demo-parents-citizenship.pdf", fileSize: "1.5 MB", uploadedAt: "Demo Document" },
    medical_report: { fileName: "demo-medical-report.pdf", fileSize: "920 KB", uploadedAt: "Demo Document" },
    identity_proof: { fileName: "demo-identity-proof.pdf", fileSize: "1.0 MB", uploadedAt: "Demo Document" },
  });
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Submission Result
  const [submittedData, setSubmittedData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data || null);
      } catch (err) {
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const config = SERVICE_CONFIGS[id] || {
    code: "GA",
    name: service?.title || "Government Service Application",
    documents: [
      { id: "identity_proof", name: "Identity Document", required: true, description: "Official identification document." },
    ],
  };

  // Step 1: Eligibility check validation
  const checkEligibility = () => {
    if (eligibility.isCitizen !== "yes") {
      return { ok: false, msg: "Applicants must be Nepalese citizens to apply for this government service online." };
    }
    if (eligibility.hasCitizenship !== "yes") {
      return { ok: false, msg: "A valid Nepalese Citizenship Certificate is required for this application process." };
    }
    if (eligibility.hasRequiredDocs !== "yes") {
      return { ok: false, msg: "Please gather all required documents before proceeding with your application." };
    }
    return { ok: true };
  };

  // Step 2: Personal details validation
  const validatePersonal = () => {
    const errs = {};
    if (!personal.fullName.trim()) errs.fullName = "Full Name is required.";
    if (!personal.dob) errs.dob = "Date of Birth is required.";
    if (!personal.citizenshipNumber.trim()) errs.citizenshipNumber = "Citizenship Number is required.";
    if (!personal.permanentAddress.trim()) errs.permanentAddress = "Permanent Address is required.";
    if (!personal.district.trim()) errs.district = "District is required.";
    if (!personal.phoneNumber.trim()) {
      errs.phoneNumber = "Phone Number is required.";
    } else if (!/^[0-9+\s-]{7,15}$/.test(personal.phoneNumber.trim())) {
      errs.phoneNumber = "Enter a valid phone number (e.g., 9841234567).";
    }
    if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3: Service details validation
  const validateServiceDetails = () => {
    const errs = {};
    if (!serviceDetails.preferredLocation.trim()) errs.preferredLocation = "Preferred Location / Office is required.";
    if (!serviceDetails.preferredDate) errs.preferredDate = "Preferred Date is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4: Documents validation
  const validateDocuments = () => {
    const errs = {};
    config.documents.forEach((doc) => {
      if (doc.required && !uploadedDocs[doc.id]) {
        errs[doc.id] = `${doc.name} is required. Please select or upload a document file.`;
      }
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Mock File Upload
  const handleFileUpload = (docId, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, [docId]: "File size must be under 10MB." }));
      return;
    }
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        uploadedAt: new Date().toLocaleTimeString(),
      },
    }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  const removeDoc = (docId) => {
    setUploadedDocs((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  // Stepper navigation handlers
  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      const check = checkEligibility();
      if (!check.ok) {
        setError(check.msg);
        return;
      }
    } else if (currentStep === 2) {
      if (!validatePersonal()) return;
    } else if (currentStep === 3) {
      if (!validateServiceDetails()) return;
    } else if (currentStep === 4) {
      if (!validateDocuments()) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Final Application
  const handleSubmit = async () => {
    if (!confirmChecked) {
      setError("Please check the confirmation box to verify your information is correct.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const docList = config.documents.map((d) => ({
        name: d.name,
        required: d.required,
        uploaded: Boolean(uploadedDocs[d.id]),
        fileName: uploadedDocs[d.id]?.fileName || "Not Provided",
      }));

      const payload = {
        serviceId: id,
        formData: {
          ...personal,
          ...serviceDetails,
        },
        documents: docList,
        appointment: {
          location: serviceDetails.preferredLocation,
          date: serviceDetails.preferredDate,
          time: serviceDetails.preferredTime,
        },
      };

      const res = await submitApplication(payload);
      setSubmittedData(res);
      setCurrentStep(6);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="svc-page">
        <div className="svc-page-body">
          <div className="svc-loading" role="status">
            <div className="svc-loading-spinner" aria-hidden="true"></div>
            <p>Loading application portal…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="svc-page">
      {/* Header Banner */}
      <div className="gov-page-header">
        <div className="gov-container">
          <div className="gov-breadcrumb">
            <Link to="/">Home</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <Link to="/services">Services</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <Link to={`/services/${id}`}>{service?.title || "Service"}</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <span>Online Application</span>
          </div>

          <span className="svc-detail-badge">Government Digital Application Portal</span>
          <h1 className="gov-page-title">{service?.title || config.name}</h1>
          <p className="gov-page-subtitle">
            Complete the multi-step online form to submit your official application.
          </p>
        </div>
      </div>

      <div className="gov-container gov-page-body">
        {/* Academic Demo Disclaimer Banner */}
        <div className="svc-demo-banner" role="region" aria-label="Academic Demo Disclaimer">
          <span className="svc-demo-badge">ACADEMIC DEMONSTRATION — DEMO FORM</span>
          <span>
            This is an academic prototype for educational and demonstration purposes. Do not enter real personal information, passwords, OTPs, citizenship numbers, passport numbers, or real government documents. This workflow uses sample data only.
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="svc-stepper" aria-label="Application progress">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.num;
            const isActive = currentStep === step.num;
            return (
              <div
                key={step.num}
                className={`svc-step-col ${isActive ? "svc-step-col--active" : ""} ${isCompleted ? "svc-step-col--completed" : ""}`}
              >
                <div className="svc-step-circle">
                  {isCompleted ? "✓" : step.num}
                </div>
                <span className="svc-step-label">{step.name}</span>
              </div>
            );
          })}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="svc-error-box" role="alert">
            <span className="svc-error-icon" aria-hidden="true">⚠</span>
            <div>
              <strong>Validation / System Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ======================================================================
            STEP 1: ELIGIBILITY CHECK
            ====================================================================== */}
        {currentStep === 1 && (
          <section className="svc-app-card">
            <h2 className="svc-app-card-title">Step 1: Eligibility Pre-Check</h2>
            <p className="svc-app-card-desc">
              Please answer the following questions to confirm your eligibility before starting the application.
            </p>

            <div className="svc-form-grid">
              <div className="svc-form-group">
                <label className="svc-form-label">1. Are you a citizen of Nepal?</label>
                <div className="svc-radio-group">
                  <label className="svc-radio-option">
                    <input
                      type="radio"
                      name="isCitizen"
                      value="yes"
                      checked={eligibility.isCitizen === "yes"}
                      onChange={(e) => setEligibility({ ...eligibility, isCitizen: e.target.value })}
                    />
                    <span>Yes, I am a Nepalese Citizen</span>
                  </label>
                  <label className="svc-radio-option">
                    <input
                      type="radio"
                      name="isCitizen"
                      value="no"
                      checked={eligibility.isCitizen === "no"}
                      onChange={(e) => setEligibility({ ...eligibility, isCitizen: e.target.value })}
                    />
                    <span>No, I am a foreign national</span>
                  </label>
                </div>
              </div>

              <div className="svc-form-group">
                <label className="svc-form-label">2. Do you hold a valid Nepalese Citizenship Certificate?</label>
                <div className="svc-radio-group">
                  <label className="svc-radio-option">
                    <input
                      type="radio"
                      name="hasCitizenship"
                      value="yes"
                      checked={eligibility.hasCitizenship === "yes"}
                      onChange={(e) => setEligibility({ ...eligibility, hasCitizenship: e.target.value })}
                    />
                    <span>Yes, I possess a Citizenship Certificate</span>
                  </label>
                  <label className="svc-radio-option">
                    <input
                      type="radio"
                      name="hasCitizenship"
                      value="no"
                      checked={eligibility.hasCitizenship === "no"}
                      onChange={(e) => setEligibility({ ...eligibility, hasCitizenship: e.target.value })}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="svc-form-group">
                <label className="svc-form-label">3. What type of application are you submitting?</label>
                <select
                  className="svc-form-input"
                  value={eligibility.applicationType}
                  onChange={(e) => setEligibility({ ...eligibility, applicationType: e.target.value })}
                >
                  <option value="new">First Time / New Application</option>
                  <option value="renewal">Renewal / Extension</option>
                  <option value="replacement">Replacement (Lost / Damaged Document)</option>
                </select>
              </div>

              <div className="svc-form-group">
                <label className="svc-form-label">4. Do you have access to clear digital copies of required documents?</label>
                <div className="svc-radio-group">
                  <label className="svc-radio-option">
                    <input
                      type="radio"
                      name="hasRequiredDocs"
                      value="yes"
                      checked={eligibility.hasRequiredDocs === "yes"}
                      onChange={(e) => setEligibility({ ...eligibility, hasRequiredDocs: e.target.value })}
                    />
                    <span>Yes, all documents are available</span>
                  </label>
                  <label className="svc-radio-option">
                    <input
                      type="radio"
                      name="hasRequiredDocs"
                      value="no"
                      checked={eligibility.hasRequiredDocs === "no"}
                      onChange={(e) => setEligibility({ ...eligibility, hasRequiredDocs: e.target.value })}
                    />
                    <span>No, missing some documents</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="svc-form-actions">
              <Link to={`/services/${id}`} className="svc-btn-secondary">
                Cancel
              </Link>
              <button type="button" className="svc-btn-primary" onClick={handleNext}>
                Continue to Personal Details →
              </button>
            </div>
          </section>
        )}

        {/* ======================================================================
            STEP 2: PERSONAL DETAILS
            ====================================================================== */}
        {currentStep === 2 && (
          <section className="svc-app-card">
            <h2 className="svc-app-card-title">Step 2: Personal Information</h2>
            <p className="svc-app-card-desc">
              Enter your official identity details exactly as they appear on your citizenship certificate.
            </p>

            <div className="svc-form-grid-2">
              <div className="svc-form-group">
                <label htmlFor="fullName" className="svc-form-label">Full Name (English) *</label>
                <input
                  id="fullName"
                  type="text"
                  className={`svc-form-input ${fieldErrors.fullName ? "svc-form-input--error" : ""}`}
                  placeholder="e.g. Ram Bahadur Thapa"
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                />
                {fieldErrors.fullName && <span className="svc-field-error">{fieldErrors.fullName}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="nepaliName" className="svc-form-label">Full Name (Nepali - देवनागरी)</label>
                <input
                  id="nepaliName"
                  type="text"
                  className="svc-form-input"
                  placeholder="उदा: राम बहादुर थापा"
                  value={personal.nepaliName}
                  onChange={(e) => setPersonal({ ...personal, nepaliName: e.target.value })}
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="dob" className="svc-form-label">Date of Birth (AD) *</label>
                <input
                  id="dob"
                  type="date"
                  className={`svc-form-input ${fieldErrors.dob ? "svc-form-input--error" : ""}`}
                  value={personal.dob}
                  onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                />
                {fieldErrors.dob && <span className="svc-field-error">{fieldErrors.dob}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="gender" className="svc-form-label">Gender *</label>
                <select
                  id="gender"
                  className="svc-form-input"
                  value={personal.gender}
                  onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="svc-form-group">
                <label htmlFor="citizenshipNumber" className="svc-form-label">Citizenship Number *</label>
                <input
                  id="citizenshipNumber"
                  type="text"
                  className={`svc-form-input ${fieldErrors.citizenshipNumber ? "svc-form-input--error" : ""}`}
                  placeholder="e.g. 27-01-75-12345"
                  value={personal.citizenshipNumber}
                  onChange={(e) => setPersonal({ ...personal, citizenshipNumber: e.target.value })}
                />
                {fieldErrors.citizenshipNumber && <span className="svc-field-error">{fieldErrors.citizenshipNumber}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="nationality" className="svc-form-label">Nationality</label>
                <input
                  id="nationality"
                  type="text"
                  className="svc-form-input"
                  value={personal.nationality}
                  disabled
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="fatherName" className="svc-form-label">Father's Full Name</label>
                <input
                  id="fatherName"
                  type="text"
                  className="svc-form-input"
                  placeholder="Father's Name"
                  value={personal.fatherName}
                  onChange={(e) => setPersonal({ ...personal, fatherName: e.target.value })}
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="motherName" className="svc-form-label">Mother's Full Name</label>
                <input
                  id="motherName"
                  type="text"
                  className="svc-form-input"
                  placeholder="Mother's Name"
                  value={personal.motherName}
                  onChange={(e) => setPersonal({ ...personal, motherName: e.target.value })}
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="grandfatherName" className="svc-form-label">Grandfather's Full Name</label>
                <input
                  id="grandfatherName"
                  type="text"
                  className="svc-form-input"
                  placeholder="Grandfather's Name"
                  value={personal.grandfatherName}
                  onChange={(e) => setPersonal({ ...personal, grandfatherName: e.target.value })}
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="district" className="svc-form-label">Permanent District *</label>
                <input
                  id="district"
                  type="text"
                  className={`svc-form-input ${fieldErrors.district ? "svc-form-input--error" : ""}`}
                  placeholder="e.g. Kathmandu, Kaski, Morang"
                  value={personal.district}
                  onChange={(e) => setPersonal({ ...personal, district: e.target.value })}
                />
                {fieldErrors.district && <span className="svc-field-error">{fieldErrors.district}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="municipality" className="svc-form-label">Municipality / Rural Municipality</label>
                <input
                  id="municipality"
                  type="text"
                  className="svc-form-input"
                  placeholder="e.g. Kathmandu Metro, Pokhara Metro"
                  value={personal.municipality}
                  onChange={(e) => setPersonal({ ...personal, municipality: e.target.value })}
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="ward" className="svc-form-label">Ward Number</label>
                <input
                  id="ward"
                  type="text"
                  className="svc-form-input"
                  placeholder="e.g. 10"
                  value={personal.ward}
                  onChange={(e) => setPersonal({ ...personal, ward: e.target.value })}
                />
              </div>

              <div className="svc-form-group">
                <label htmlFor="permanentAddress" className="svc-form-label">Permanent Address Line *</label>
                <input
                  id="permanentAddress"
                  type="text"
                  className={`svc-form-input ${fieldErrors.permanentAddress ? "svc-form-input--error" : ""}`}
                  placeholder="Tole / Street Address"
                  value={personal.permanentAddress}
                  onChange={(e) => setPersonal({ ...personal, permanentAddress: e.target.value })}
                />
                {fieldErrors.permanentAddress && <span className="svc-field-error">{fieldErrors.permanentAddress}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="phoneNumber" className="svc-form-label">Mobile Phone Number *</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  className={`svc-form-input ${fieldErrors.phoneNumber ? "svc-form-input--error" : ""}`}
                  placeholder="98XXXXXXXX"
                  value={personal.phoneNumber}
                  onChange={(e) => setPersonal({ ...personal, phoneNumber: e.target.value })}
                />
                {fieldErrors.phoneNumber && <span className="svc-field-error">{fieldErrors.phoneNumber}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="email" className="svc-form-label">Email Address (Optional)</label>
                <input
                  id="email"
                  type="email"
                  className={`svc-form-input ${fieldErrors.email ? "svc-form-input--error" : ""}`}
                  placeholder="yourname@domain.com"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                />
                {fieldErrors.email && <span className="svc-field-error">{fieldErrors.email}</span>}
              </div>
            </div>

            <div className="svc-form-actions">
              <button type="button" className="svc-btn-secondary" onClick={handleBack}>
                ← Back
              </button>
              <button type="button" className="svc-btn-primary" onClick={handleNext}>
                Continue to Service Details →
              </button>
            </div>
          </section>
        )}

        {/* ======================================================================
            STEP 3: SERVICE DETAILS & APPOINTMENT
            ====================================================================== */}
        {currentStep === 3 && (
          <section className="svc-app-card">
            <h2 className="svc-app-card-title">Step 3: Service Information & Appointment</h2>
            <p className="svc-app-card-desc">
              Specify your service options and choose your preferred appointment time and location.
            </p>

            <div className="svc-form-grid-2">
              <div className="svc-form-group">
                <label htmlFor="appType" className="svc-form-label">Application Type</label>
                <select
                  id="appType"
                  className="svc-form-input"
                  value={serviceDetails.applicationType}
                  onChange={(e) => setServiceDetails({ ...serviceDetails, applicationType: e.target.value })}
                >
                  <option value="New">New Application</option>
                  <option value="Renewal">Renewal</option>
                  <option value="Replacement">Replacement</option>
                </select>
              </div>

              {Number(id) === 2 && (
                <>
                  <div className="svc-form-group">
                    <label htmlFor="passportType" className="svc-form-label">Passport Booklet Type</label>
                    <select
                      id="passportType"
                      className="svc-form-input"
                      value={serviceDetails.passportType}
                      onChange={(e) => setServiceDetails({ ...serviceDetails, passportType: e.target.value })}
                    >
                      <option value="Ordinary (34 Pages)">Ordinary Passport (34 Pages)</option>
                      <option value="Ordinary (66 Pages)">Ordinary Passport (66 Pages - Frequent Traveler)</option>
                      <option value="Official">Official Passport</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label htmlFor="applicationPriority" className="svc-form-label">Processing Speed / Priority</label>
                    <select
                      id="applicationPriority"
                      className="svc-form-input"
                      value={serviceDetails.applicationPriority}
                      onChange={(e) => setServiceDetails({ ...serviceDetails, applicationPriority: e.target.value })}
                    >
                      <option value="Standard">Standard Processing (NPR 5,000)</option>
                      <option value="Express">Express / Fast Track (NPR 12,000)</option>
                    </select>
                  </div>
                </>
              )}

              {Number(id) === 3 && (
                <>
                  <div className="svc-form-group">
                    <label htmlFor="licenseCategory" className="svc-form-label">Vehicle Category</label>
                    <select
                      id="licenseCategory"
                      className="svc-form-input"
                      value={serviceDetails.licenseCategory}
                      onChange={(e) => setServiceDetails({ ...serviceDetails, licenseCategory: e.target.value })}
                    >
                      <option value="A (Motorcycle / Scooter)">Category A — Motorcycle / Scooter</option>
                      <option value="B (Car / Jeep / Delivery Van)">Category B — Car / Jeep / Delivery Van</option>
                      <option value="C (Heavy Vehicle)">Category C — Heavy Vehicle</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label htmlFor="bloodGroup" className="svc-form-label">Blood Group</label>
                    <select
                      id="bloodGroup"
                      className="svc-form-input"
                      value={serviceDetails.bloodGroup}
                      onChange={(e) => setServiceDetails({ ...serviceDetails, bloodGroup: e.target.value })}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </>
              )}

              <div className="svc-form-group svc-form-group-full">
                <label htmlFor="preferredLocation" className="svc-form-label">Preferred Appointment Office / Center *</label>
                <select
                  id="preferredLocation"
                  className={`svc-form-input ${fieldErrors.preferredLocation ? "svc-form-input--error" : ""}`}
                  value={serviceDetails.preferredLocation}
                  onChange={(e) => setServiceDetails({ ...serviceDetails, preferredLocation: e.target.value })}
                >
                  <option value="Department of Passports, Tripureshwor, Kathmandu">Department of Passports, Tripureshwor, Kathmandu</option>
                  <option value="District Administration Office (DAO), Babarmahal, Kathmandu">District Administration Office (DAO), Babarmahal, Kathmandu</option>
                  <option value="DAO Lalitpur, Manbhawan">DAO Lalitpur, Manbhawan</option>
                  <option value="DAO Bhaktapur, Suryabinayak">DAO Bhaktapur, Suryabinayak</option>
                  <option value="Transport Management Office, Ekantakuna, Lalitpur">Transport Management Office, Ekantakuna, Lalitpur</option>
                  <option value="DAO Kaski, Pokhara">DAO Kaski, Pokhara</option>
                  <option value="DAO Morang, Biratnagar">DAO Morang, Biratnagar</option>
                </select>
                {fieldErrors.preferredLocation && <span className="svc-field-error">{fieldErrors.preferredLocation}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="preferredDate" className="svc-form-label">Preferred Appointment Date *</label>
                <input
                  id="preferredDate"
                  type="date"
                  className={`svc-form-input ${fieldErrors.preferredDate ? "svc-form-input--error" : ""}`}
                  min={new Date().toISOString().split("T")[0]}
                  value={serviceDetails.preferredDate}
                  onChange={(e) => setServiceDetails({ ...serviceDetails, preferredDate: e.target.value })}
                />
                {fieldErrors.preferredDate && <span className="svc-field-error">{fieldErrors.preferredDate}</span>}
              </div>

              <div className="svc-form-group">
                <label htmlFor="preferredTime" className="svc-form-label">Preferred Time Slot *</label>
                <select
                  id="preferredTime"
                  className="svc-form-input"
                  value={serviceDetails.preferredTime}
                  onChange={(e) => setServiceDetails({ ...serviceDetails, preferredTime: e.target.value })}
                >
                  <option value="10:00 AM">10:00 AM – 11:30 AM</option>
                  <option value="11:30 AM">11:30 AM – 01:00 PM</option>
                  <option value="01:30 PM">01:30 PM – 03:00 PM</option>
                  <option value="03:00 PM">03:00 PM – 04:30 PM</option>
                </select>
              </div>
            </div>

            <div className="svc-form-actions">
              <button type="button" className="svc-btn-secondary" onClick={handleBack}>
                ← Back
              </button>
              <button type="button" className="svc-btn-primary" onClick={handleNext}>
                Continue to Documents →
              </button>
            </div>
          </section>
        )}

        {/* ======================================================================
            STEP 4: DOCUMENTS UPLOAD
            ====================================================================== */}
        {currentStep === 4 && (
          <section className="svc-app-card">
            <h2 className="svc-app-card-title">Step 4: Required Documents Upload</h2>
            <p className="svc-app-card-desc">
              Attach clear scans or photos of your required verification documents (PDF, JPG, PNG under 10MB).
            </p>

            <div className="svc-doc-list">
              {config.documents.map((doc) => {
                const isUploaded = Boolean(uploadedDocs[doc.id]);
                const docData = uploadedDocs[doc.id];
                return (
                  <div key={doc.id} className={`svc-doc-card ${isUploaded ? "svc-doc-card--uploaded" : ""}`}>
                    <div className="svc-doc-header">
                      <div className="svc-doc-info">
                        <span className="svc-doc-icon">{isUploaded ? "✅" : "📄"}</span>
                        <div>
                          <h3 className="svc-doc-name">
                            {doc.name} {doc.required && <span className="svc-badge-req">Required</span>}
                          </h3>
                          <p className="svc-doc-desc">{doc.description}</p>
                        </div>
                      </div>

                      <div className="svc-doc-status">
                        {isUploaded ? (
                          <span className="svc-doc-tag svc-doc-tag--done">Uploaded</span>
                        ) : (
                          <span className="svc-doc-tag svc-doc-tag--pending">Not Uploaded</span>
                        )}
                      </div>
                    </div>

                    {isUploaded ? (
                      <div className="svc-doc-file-info">
                        <span className="svc-doc-filename">📁 {docData.fileName} ({docData.fileSize})</span>
                        <div className="svc-doc-actions">
                          <label className="svc-btn-sm svc-btn-sm-outline">
                            Replace File
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              hidden
                              onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                            />
                          </label>
                          <button
                            type="button"
                            className="svc-btn-sm svc-btn-sm-danger"
                            onClick={() => removeDoc(doc.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="svc-doc-upload-box">
                        <label className="svc-file-picker-label">
                          <span className="svc-upload-icon">📤</span>
                          <span>Click to select file or drag & drop</span>
                          <span className="svc-upload-hint">Supports JPG, PNG, PDF up to 10MB</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            hidden
                            onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                          />
                        </label>
                      </div>
                    )}

                    {fieldErrors[doc.id] && <span className="svc-field-error" style={{ marginTop: 8 }}>{fieldErrors[doc.id]}</span>}
                  </div>
                );
              })}
            </div>

            <div className="svc-form-actions">
              <button type="button" className="svc-btn-secondary" onClick={handleBack}>
                ← Back
              </button>
              <button type="button" className="svc-btn-primary" onClick={handleNext}>
                Continue to Review →
              </button>
            </div>
          </section>
        )}

        {/* ======================================================================
            STEP 5: REVIEW & CONFIRM
            ====================================================================== */}
        {currentStep === 5 && (
          <section className="svc-app-card">
            <h2 className="svc-app-card-title">Step 5: Review Application Summary</h2>
            <p className="svc-app-card-desc">
              Please double check all submitted information prior to official submission.
            </p>

            <div className="svc-review-sections">
              {/* Personal Info Review */}
              <div className="svc-review-box">
                <div className="svc-review-box-header">
                  <h3>Personal Information</h3>
                  <button type="button" className="svc-btn-edit" onClick={() => setCurrentStep(2)}>
                    ✎ Edit
                  </button>
                </div>
                <div className="svc-review-grid">
                  <div><strong>Full Name:</strong> {personal.fullName}</div>
                  <div><strong>Nepali Name:</strong> {personal.nepaliName || "N/A"}</div>
                  <div><strong>Date of Birth:</strong> {personal.dob}</div>
                  <div><strong>Gender:</strong> {personal.gender}</div>
                  <div><strong>Citizenship No:</strong> {personal.citizenshipNumber}</div>
                  <div><strong>Phone:</strong> {personal.phoneNumber}</div>
                  <div><strong>Email:</strong> {personal.email || "N/A"}</div>
                  <div><strong>District:</strong> {personal.district}</div>
                  <div><strong>Address:</strong> {personal.permanentAddress}</div>
                </div>
              </div>

              {/* Service Info Review */}
              <div className="svc-review-box">
                <div className="svc-review-box-header">
                  <h3>Service Information & Appointment</h3>
                  <button type="button" className="svc-btn-edit" onClick={() => setCurrentStep(3)}>
                    ✎ Edit
                  </button>
                </div>
                <div className="svc-review-grid">
                  <div><strong>Service:</strong> {service?.title || config.name}</div>
                  <div><strong>Application Type:</strong> {serviceDetails.applicationType}</div>
                  {Number(id) === 2 && <div><strong>Passport Type:</strong> {serviceDetails.passportType}</div>}
                  {Number(id) === 2 && <div><strong>Priority:</strong> {serviceDetails.applicationPriority}</div>}
                  {Number(id) === 3 && <div><strong>Category:</strong> {serviceDetails.licenseCategory}</div>}
                  <div><strong>Appointment Office:</strong> {serviceDetails.preferredLocation}</div>
                  <div><strong>Appointment Date:</strong> {serviceDetails.preferredDate}</div>
                  <div><strong>Time Slot:</strong> {serviceDetails.preferredTime}</div>
                </div>
              </div>

              {/* Documents Review */}
              <div className="svc-review-box">
                <div className="svc-review-box-header">
                  <h3>Uploaded Documents</h3>
                  <button type="button" className="svc-btn-edit" onClick={() => setCurrentStep(4)}>
                    ✎ Edit
                  </button>
                </div>
                <ul className="svc-review-doc-list">
                  {config.documents.map((d) => (
                    <li key={d.id}>
                      <span>{d.name}:</span>{" "}
                      {uploadedDocs[d.id] ? (
                        <span className="svc-text-success">✓ Uploaded ({uploadedDocs[d.id].fileName})</span>
                      ) : (
                        <span className="svc-text-muted">Not Provided</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="svc-declaration-box">
              <label className="svc-checkbox-label">
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                />
                <span>
                  I confirm that all information provided in this application is accurate and complete to the best of my knowledge. I understand that submitting false declarations may lead to rejection.
                </span>
              </label>
            </div>

            <div className="svc-form-actions">
              <button type="button" className="svc-btn-secondary" onClick={handleBack}>
                ← Back
              </button>
              <button
                type="button"
                className="svc-btn-submit"
                onClick={handleSubmit}
                disabled={submitting || !confirmChecked}
              >
                {submitting ? "Submitting Application…" : "Submit Application →"}
              </button>
            </div>
          </section>
        )}

        {/* ======================================================================
            STEP 6: SUBMITTED CONFIRMATION
            ====================================================================== */}
        {currentStep === 6 && submittedData && (
          <section className="svc-app-card svc-success-card">
            <div className="svc-success-icon">🎓</div>
            <h2 className="svc-success-title">Demo Application Completed!</h2>
            <p className="svc-success-desc">
              This is a demonstration only. No application has been submitted to any government department or official government system.
            </p>

            <div className="svc-app-id-badge">
              <span className="svc-app-id-label">Demo Reference Number</span>
              <strong className="svc-app-id-value">DEMO-{submittedData.applicationNumber || "2026-000123"}</strong>
            </div>

            <div className="svc-success-details">
              <div className="svc-success-grid">
                <div><strong>Service Name:</strong> {service?.title || config.name}</div>
                <div><strong>Applicant Name:</strong> {submittedData.applicantName || personal.fullName} (Demo)</div>
                <div><strong>Current Status:</strong> <span className="svc-status-tag">DEMO SUBMITTED</span></div>
                <div><strong>System:</strong> SewaBot Academic Prototype</div>
                <div><strong>Appointment Office:</strong> {submittedData.appointment?.location || serviceDetails.preferredLocation}</div>
                <div><strong>Appointment Date:</strong> {submittedData.appointment?.date || serviceDetails.preferredDate} ({submittedData.appointment?.time || serviceDetails.preferredTime})</div>
              </div>
            </div>

            <div className="svc-success-actions">
              <button
                type="button"
                className="svc-btn-primary"
                onClick={() => navigate(`/track/${submittedData.applicationNumber}`)}
              >
                Track Demo Status →
              </button>
              <button
                type="button"
                className="svc-btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                View My Demo Applications
              </button>
              <button
                type="button"
                className="svc-btn-reset"
                onClick={() => window.print()}
              >
                🖨️ Print Demo Receipt
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ApplicationFormPage;
