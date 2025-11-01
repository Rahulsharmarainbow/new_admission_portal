import React from "react";
import { Breadcrumb } from "flowbite-react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useAuth } from "src/hook/useAuth";

interface BreadcrumbHeaderProps {
  title: string;
  paths?: { name: string; link?: string }[];
}

const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({ title, paths }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 rounded-full px-10 py-7 shadow-sm mb-6">
      {/* Left section - Back & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="text-[#3b82f6] hover:text-blue-600 transition"
        >
          <FaArrowLeft size={18} />
        </button>
        <h2 className="text-xl md:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>

      {/* Right section - Breadcrumb */}
      <Breadcrumb className="mt-2 sm:mt-0 md:text-m">
        <li className="flex items-center">
          <FaHome className="mr-2 text-gray-500" />
          <Link to={`/${user?.role}/dashboard`} className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
        </li>

        {paths?.map((path, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <span className="mx-2 text-gray-400">›</span>
            {path.link ? (
              <Link to={path.link} className="hover:text-blue-600">
                {path.name}
              </Link>
            ) : (
              <span>{path.name}</span>
            )}
          </li>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbHeader;
