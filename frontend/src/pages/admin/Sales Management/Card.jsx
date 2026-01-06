import React from 'react';

const Card = ({ title, value, icon, bgColor, iconColor }) => {
  // Safe color mapping if simple strings like "blue" are passed
  const getIconBgColor = (color) => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      red: "bg-red-500"
    };
    return colors[color] || color; // Fallback to passed class if not in map
  };

  const getIconTextColor = (color) => {
    // If passing a simple color, we want white text usually for the icon inside a colored circle?
    // Original code used `text-${iconColor}-100`.
    return `text-white`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center transition-all duration-200 hover:shadow-md">
      <div className={`rounded-full p-3 ${getIconBgColor(bgColor)} text-white`}>
        {icon &&
          React.cloneElement(icon, {
            className: `h-6 w-6`,
          })}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </div>
    </div>
  )
};

export default Card;

