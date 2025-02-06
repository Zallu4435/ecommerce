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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 place-items-center dark:bg-gray-900">
      {sections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-center text-center sm:text-left w-full max-w-xs md:max-w-sm lg:max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-all"
        >
          <div className="text-primary p-4 bg-gray-200 dark:bg-gray-700 rounded-full sm:mr-6 flex-shrink-0 flex items-center justify-center">
            <div className="text-3xl sm:text-4xl md:text-5xl text-gray-800 dark:text-gray-200">
              {section.icon}
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-start">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {section.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
              {section.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSection_6;
