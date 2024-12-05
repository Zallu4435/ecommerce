import React, { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle the theme between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Effect to apply dark mode class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-white", "text-black");
    } else {
      document.body.classList.add("bg-white", "text-black");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center justify-center py-10">
      {/* Switch Button */}
      <label htmlFor="theme-switch" className="cursor-pointer flex items-center">
        <div className="relative">
          <input
            id="theme-switch"
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleTheme}
            className="sr-only"
          />
          {/* Switch Styling */}
          <div className="w-14 h-8 bg-gray-300 rounded-full p-1 flex items-center">
            {/* Circle that moves when toggled */}
            <div
              className={`w-6 h-6 bg-white rounded-full transition-all ${
                isDarkMode ? "transform translate-x-6" : ""
              }`}
            ></div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
