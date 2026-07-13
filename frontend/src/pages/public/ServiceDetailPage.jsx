import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "../../api/serviceApi";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load service detail.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-4 text-red-600">{error}</div>;
  if (!service) return <div className="max-w-4xl mx-auto p-4">Service not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Link to="/services" className="text-blue-600 hover:underline">
        ← Back to Services
      </Link>

      <h1 className="text-2xl font-bold">{service.title}</h1>
      <p className="text-gray-700">{service.description}</p>

      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <p><strong>Department:</strong> {service.department?.name}</p>
        <p><strong>Category:</strong> {service.category?.name}</p>
        <p><strong>Eligibility:</strong> {service.eligibility || "N/A"}</p>
        <p><strong>Required Documents:</strong> {service.requiredDocuments || "N/A"}</p>
        <p><strong>Process Steps:</strong> {service.processSteps || "N/A"}</p>
        <p><strong>Fee Info:</strong> {service.feeInfo || "N/A"}</p>
        <p><strong>Office Info:</strong> {service.officeInfo || "N/A"}</p>
      </div>
    </div>
  );
};

export default ServiceDetailPage;