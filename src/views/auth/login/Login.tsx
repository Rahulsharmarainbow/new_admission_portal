import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import AuthLogin from "../authforms/AuthLogin";
import { Link } from "react-router";
import img1 from "../../../../public/login3-bg.png"

const Login = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Image Section - 55% */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img
          src={img1}
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Text Content Overlay */}
        {/* <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-6">Admission Portal</h1>
            <p className="text-xl opacity-90 mb-8">
              Streamlined admission process for students and administrators
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <div className="space-y-6">

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-left">Online Application Submission</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-left">Application Status Tracking</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-left">Document Upload & Management</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-left">Real-time Notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Login Form Section - 45% */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-xl shadow-lg bg-white dark:bg-darkgray p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2 p-0 w-full">
              <div className="mx-auto mb-6">
                <FullLogo />
              </div>
              <AuthLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;