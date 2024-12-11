import React from 'react';
import { Link } from 'react-router-dom';
import { notFound } from '../../assets/images';

const NotFound = ({ fromUserProfileLayout }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${fromUserProfileLayout ? 'h-auto min-h-[300px] bg-transparent text-gray-800 dark:text-gray-100' : 'min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100'}`}>
      {/* 404 Image */}
      <img
        src={notFound} 
        alt="404"
        className={`${fromUserProfileLayout ? 'w-60 h-auto mb-4' : 'w-full max-w-lg h-auto mb-6'}`}
      />
      
      {/* Heading */}
      <h1 className={`${fromUserProfileLayout ? 'text-2xl sm:text-3xl font-bold text-center mb-2' : 'text-4xl sm:text-5xl font-bold text-center mb-4'}`}>
        Oops! Page Not Found
      </h1>
      
      {/* Description */}
      <p className={`${fromUserProfileLayout ? 'text-base sm:text-lg text-center mb-4' : 'text-lg sm:text-xl text-center mb-8'}`}>
        The page you are looking for doesn’t exist or has been moved.
      </p>
      
      {/* Redirect Button */}
      <Link
        to="/"
        className={`${fromUserProfileLayout ? 'px-4 py-2 bg-pink-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-pink-600 transition duration-300' : 'px-6 py-3 bg-pink-500 text-white text-lg sm:text-xl font-semibold rounded-lg hover:bg-pink-600 transition duration-300'}`}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
