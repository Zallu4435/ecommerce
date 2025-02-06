import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DesktopComputerIcon, ChevronRightIcon } from '@heroicons/react/solid';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get the base section (e.g., "couponManagement" from "couponManagement/update/coupons/123")
  const getBaseSection = (path) => {
    const segments = path.split('/').filter(Boolean);
    return segments[1] || ''; // Return the second segment (after "admin") or empty string
  };

  // Function to get the action (e.g., "update" or "view")
  const getAction = (path) => {
    const segments = path.split('/').filter(Boolean);
    return segments[2] || ''; // Return the third segment or empty string
  };

  // Function to get the ID if present
  const getId = (path) => {
    const segments = path.split('/').filter(Boolean);
    return segments[segments.length - 1];
  };

  const baseSection = getBaseSection(location.pathname);
  const action = getAction(location.pathname);
  const id = getId(location.pathname);

  const handleBack = () => {
    navigate(`/admin/${baseSection}`);
  };

  return (
    <nav className="bg-orange-100 fixed right-0 z-50 left-[420px] dark:bg-gray-700 p-3 rounded-md">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
        <li>
          <Link to="/admin/dashboard" className="hover:underline text-blue-500 flex items-center">
            <DesktopComputerIcon className="h-5 w-5 mr-1" />
            Dashboard
          </Link>
        </li>
        {baseSection && (
          <>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <li>
              <span
                className="hover:underline text-blue-500 capitalize cursor-pointer"
                onClick={handleBack}
              >
                {baseSection.replace(/Management$/, '')}
              </span>
            </li>
          </>
        )}
        {action && (
          <>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <li>
              <span className="text-gray-500 dark:text-gray-400 capitalize">
                {action}
              </span>
            </li>
          </>
        )}
        {id && action !== 'create' && (
          <>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <li>
              <span className="text-gray-500 dark:text-gray-400">
                {id}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
