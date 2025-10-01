import React from "react";
import FullLogo from "./full/shared/logo/FullLogo";
import img1 from "../../public/login3-bg.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      {/* Main Box */}
      <div className="flex w-full max-w-[80%] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Left Section - Image / Illustration */}
        <div className="hidden lg:flex w-[75%] items-center justify-center bg-gray-50 dark:bg-gray-700">
          <img
            src={img1}
            alt="Login Illustration"
            className="w-4/5 h-auto object-contain"
          />
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8">
          <div className="flex flex-col items-center mb-6">
            <FullLogo />
            {title && (
              <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
