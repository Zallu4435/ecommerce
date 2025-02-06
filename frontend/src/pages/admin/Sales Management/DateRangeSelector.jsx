import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const DateRangeSelector = ({
  dateRange,
  setDateRange,
  customDates,
  setCustomDates,
}) => {
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [tempCustomDates, setTempCustomDates] = useState({
    start: "",
    end: "",
  });

  const handleDateRangeChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "Custom") {
      setShowCustomDates(true);
      setTempCustomDates({ start: "", end: "" });
    } else {
      setShowCustomDates(false);
      setDateRange(newValue);
    }
  };

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setTempCustomDates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCustomDates = () => {
    if (tempCustomDates.start && tempCustomDates.end) {
      setDateRange("Custom");
      setCustomDates(tempCustomDates);
      setShowCustomDates(false);
    }
  };

  const handleCancel = () => {
    setShowCustomDates(false);
    setDateRange("This Week");
    setTempCustomDates({ start: "", end: "" });
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="appearance-none bg-red-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
            <option>Custom</option>
          </select>
          <div
            className="pointer-events-none absolute flex items-center right-2"
            style={{ top: "calc(50% - 8px)" }}
          >
            <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
        </div>
      </div>

      {showCustomDates && (
        <div className="absolute mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              <input
                type="date"
                name="start"
                value={tempCustomDates.start}
                onChange={handleCustomDateChange}
                className="border dark:border-gray-300 border-gray-700 rounded-md py-2 px-3 text-gray-700 text-sm bg-white dark:text-gray-200 dark:bg-gray-700"
              />
              <input
                type="date"
                name="end"
                value={tempCustomDates.end}
                onChange={handleCustomDateChange}
                className="border dark:border-gray-300 border-gray-700 rounded-md py-2 px-3 text-gray-700 text-sm bg-white dark:text-gray-200 dark:bg-gray-700"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomDates}
                disabled={!tempCustomDates.start || !tempCustomDates.end}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
