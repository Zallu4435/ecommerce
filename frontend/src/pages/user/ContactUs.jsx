import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../../validation/schemas/contactSchema.js';


const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // Form submission handler
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center  md:py-10">
      <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-[57%] bg-white dark:bg-gray-800 md:p-8 p-5 sm:p-10 rounded-xl shadow-xl">
        
        {/* Header Section */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 md:mb-8 mb-4 mt-5">
          Contact Us
        </h1>

        {/* Contact Info Section */}
        <div className="mb-8 text-center">
          <p className="md:text-lg text-gray-700 dark:text-gray-300">
            We’d love to hear from you! Whether you have a question, suggestion, or just want to say hello, feel free to reach out.
          </p>
        </div>

        {/* Contact Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6 space-y-2">
          {/* Name and Email Fields in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Message Field in a Separate Row */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              {...register('message')}
              rows="5"
              className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500`}
            />
            {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto py-3 mt-2 md:mt-0 px-6 bg-pink-500 text-white font-semibold rounded-md shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Address Section */}
        <div className="md:mt-10 mt-8 text-center text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4">Our Office</h2>
          <p className="md:text-lg">
            123 Fashion Street, <br />
            Style City, 45678
          </p>
          <p className="mt-4 md:text-lg">
            Email: <span className="font-semibold">contact@fashionstore.com</span>
          </p>
          <p className="mt-2 md:text-lg">
            Phone: <span className="font-semibold">+1 (800) 123-4567</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
