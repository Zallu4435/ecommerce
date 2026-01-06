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
  const [error, setError] = useState("");

  const handleDateRangeChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "Custom") {
      setShowCustomDates(true);
      setTempCustomDates({ start: "", end: "" });
      setError("");
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
    if (error) setError("");
  };

  const validateDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (startDate > endDate) {
      return "Start date cannot be after end date.";
    }

    if (startDate > today || endDate > today) {
      return "Dates cannot be in the future.";
    }

    return "";
  };

  const handleApplyCustomDates = () => {
    if (!tempCustomDates.start || !tempCustomDates.end) {
      setError("Please select both start and end dates.");
      return;
    }

    const validationError = validateDates(tempCustomDates.start, tempCustomDates.end);
    if (validationError) {
      setError(validationError);
      return;
    }

    setDateRange("Custom");
    setCustomDates(tempCustomDates);
    setShowCustomDates(false);
    setError("");
  };

  const handleCancel = () => {
    setShowCustomDates(false);
    // Only reset to previous valid range if we are cancelling out of the Custom selection flow entirely
    // But here the dropdown value is effectively controlled by `dateRange` prop passed down.
    // If the user selected "Custom" in dropdown but cancels the popup, we should probably revert the dropdown to the *active* dateRange.
    // However, the dropdown `value` is `dateRange`. If `dateRange` is currently "This Week" and user clicks "Custom", validation logic runs.

    // If `dateRange` was already "Custom" and user is just editing, cancelling should keep it strict.
    // If `dateRange` changes to "Custom" visually in the Select *before* this popup (it does in `handleDateRangeChange`), 
    // we need to handle the case where user cancels the custom selection but the dropdown says "Custom".

    // Actually, `handleDateRangeChange` only sets `setShowCustomDates(true)` and DOES NOT call `setDateRange("Custom")` yet!
    // It only checks `newValue === "Custom"`.
    // Wait, let's look at `handleDateRangeChange`:
    // if (newValue === "Custom") { setShowCustomDates(true); ... } else { setDateRange(newValue); }
    // So `dateRange` prop is NOT updated to "Custom" yet. The dropdown will still show the *old* value because `value={dateRange}`.
    // EXCEPT, the browser might optimistically update the select display? No, it's controlled.
    // So the dropdown stays on "This Week" while the popup is open?
    // Let's check the render: `value={dateRange}`.
    // So if dateRange is "This Week", and user selects "Custom", `handleDateRangeChange` fires.
    // `dateRange` is static. The select might not show "Custom" selected?
    // Actually, controlled components in React usually don't change visual value until props update.
    // But standard HTML select behavior might show the selected option momentarily or if logic allows.
    // If `dateRange` isn't updated, the Select will snap back to "This Week" on re-render if we don't handle it.
    // This is fine. The user sees the popup.

    setError("");
    setTempCustomDates({ start: "", end: "" });
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 dark:text-gray-200 shadow-sm transition-all"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
            <option value="Custom">Custom</option>
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
        <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 w-72">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Date Range</h3>
          <div className="flex flex-col space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">Start Date</label>
                <input
                  type="date"
                  name="start"
                  value={tempCustomDates.start}
                  onChange={handleCustomDateChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full border dark:border-gray-600 border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm bg-gray-50 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">End Date</label>
                <input
                  type="date"
                  name="end"
                  value={tempCustomDates.end}
                  onChange={handleCustomDateChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full border dark:border-gray-600 border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm bg-gray-50 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomDates}
                className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
