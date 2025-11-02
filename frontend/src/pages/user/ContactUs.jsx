import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../../validation/schemas/contactSchema.js";
import { useContactMutation } from "../../redux/apiSliceFeatures/userProfileApi.js";
import { toast } from 'react-toastify'
const ContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const [contact, { isLoading }] = useContactMutation();

  const onSubmit = async (data) => {
    try {
      await contact(data).unwrap();
      reset();
      toast.success("Successfully placed your message");
    } catch (error) {
      console.error("Request Error:", error);
      toast.error(error?.data?.message || "An error occurred");
    }
     
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center  md:py-10">
      <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-[57%] bg-white dark:bg-gray-800 md:p-8 p-5 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 md:mb-8 mb-4 mt-5">
          Contact Us
        </h1>

        <div className="mb-8 text-center">
          <p className="md:text-lg text-gray-700 dark:text-gray-300">
            We’d love to hear from you! Whether you have a question, suggestion,
            or just want to say hello, feel free to reach out.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:space-y-6 space-y-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                {...register("name")}
                className={`w-full p-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={`w-full p-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 focus:border-pink-500 dark:text-white dark:focus:ring-pink-500`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Your Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              {...register("message")}
              rows="5"
              className={`w-full p-3 border ${
                errors.message ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500`}
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto py-3 mt-2 md:mt-0 px-6 bg-pink-500 text-white font-semibold rounded-md shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <div className="md:mt-10 mt-8 text-center text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4">Our Office</h2>
          <p className="md:text-lg">
            456 <b>VAGO</b> Fashion Street, <br />
            Style City, 45678
          </p>
          <p className="mt-4 md:text-lg">
            Email:{" "}
            <span className="font-semibold">vago@gmail.com</span>
          </p>
          <p className="mt-2 md:text-lg">
            Phone: <span className="font-semibold">022-12345678</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
