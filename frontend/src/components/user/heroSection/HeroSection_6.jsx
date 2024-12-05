import React from "react";
import { FaCarSide } from "react-icons/fa6";

const HeroSection_6 = () => {
  const sections = [
    {
      title: "Free Shipping",
      description: "Free shipping all over the US",
      icon: <FaCarSide />,
    },
    {
      title: "100% Satisfaction",
      description: "Satisfaction guaranteed on all products",
      icon: <FaCarSide />,
    },
    {
      title: "Secure Payments",
      description: "Safe and secure payment methods",
      icon: <FaCarSide />,
    },
    {
      title: "24/7 Support",
      description: "Support available 24/7",
      icon: <FaCarSide />,
    },
  ];

  return (
    <div className="grid grid-cols-4 justify-center items-center gap-6 p-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-center text-center sm:text-left w-[450px] bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-2xl transition-all"
        >
          {/* Icon */}
          <div className="text-primary p-4 bg-gray-100 rounded-full sm:mr-6 flex-shrink-0">
            <div className="text-4xl sm:text-5xl">{section.icon}</div>
          </div>
          {/* Text */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{section.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSection_6;
