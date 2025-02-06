import React from 'react';

const Card = ({ title, value, icon, bgColor, iconColor }) => (
  <div className="bg-yellow-100 dark:bg-gray-800 rounded-lg shadow p-6 transition transform hover:scale-105">
    <div className="flex items-center">
      <div className={`bg-${bgColor}-500 rounded-full p-3`}>
        {icon &&
          React.cloneElement(icon, {
            className: `h-6 w-6 text-${iconColor}-100`,
          })}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default Card;

