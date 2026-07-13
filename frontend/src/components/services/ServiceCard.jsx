import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 border">
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{service.description}</p>

      <div className="mt-3 text-xs text-gray-500">
        <p>Department: {service.department?.name}</p>
        <p>Category: {service.category?.name}</p>
      </div>

      <Link
        to={`/services/${service.id}`}
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
};

export default ServiceCard;