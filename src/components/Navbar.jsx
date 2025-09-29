import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-950 text-white px-4 sm:px-6 py-2 flex flex-col sm:flex-row justify-between items-center shadow-md fixed w-full z-50">
      {/* Left Section - Logo + Company Name */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
        <img
          src="https://baseldtsolutions.com/wp-content/uploads/2024/12/cropped-cropped-logoout.png"
          alt="Company Logo"
          className="w-16 h-16 sm:w-20 sm:h-20"
        />
        <h1 className="text-lg sm:text-2xl font-bold text-orange-400 text-center sm:text-left">
          Basel Dynamics Tech Solutions Pvt.Ltd
        </h1>
      </div>

      {/* Right Section - Contact Info */}
      <div className="flex flex-col sm:flex-col sm:items-center text-center sm:text-right  sm:gap-1">
        <span className="text-orange-400 font-medium text-sm sm:text-base">
          info@baseldtsolutions.com
        </span>
        <span className="text-sm sm:text-base">Mon - Friday | 24/7</span>
        <span className="font-semibold text-sm sm:text-base">+91 8885525531</span>
      </div>
    </nav>
  );
}
