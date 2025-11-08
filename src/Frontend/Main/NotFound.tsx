import React from "react";
import { useNavigate } from "react-router";
import errorImg from "../../assets/images/backgrounds/errorimg.svg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 px-8 py-10 text-center max-w-lg">
        <img
          src={errorImg}
          alt="Not Found Illustration"
          className="w-64 mx-auto mb-6"
        />

        <h1 className="text-5xl font-extrabold text-red-600 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page or institute you are looking for doesn’t exist or failed to load.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="inline-block bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
