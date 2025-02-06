import { aboutUsImg } from "../../assets/images";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const features = [
    "Latest Trends: Always stay on top of the hottest fashion trends.",
    "Quality Fabrics: We use only the best fabrics for style and comfort.",
    "Affordable Prices: Fashion doesn't have to break the bank.",
    "Inclusive Sizing: We offer sizes for every body type, from petite to plus size.",
    "Free Shipping: Enjoy free shipping on all orders, no minimum required.",
    "Easy Returns: Shop with confidence knowing returns are hassle-free.",
  ];

  return (
    <div className="dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen flex flex-col items-center md:py-10">
      <div className="w-full sm:w-3/4 lg:w-2/3 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl transition-all hover:shadow-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
          About Us
        </h1>

        <div className="flex justify-center mb-8">
          <img
            src={aboutUsImg}
            alt="Fashion Store"
            className="md:w-80 md:h-80 w-60 h-60 object-cover rounded-full shadow-xl transition-transform transform hover:scale-110"
          />
        </div>

        <p className="md:text-lg text-gray-700 dark:text-gray-300 mb-6 text-xs text-center">
          Welcome to{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">
            VAGO
          </span>
          , where we bring you the latest trends and styles. From chic
          streetwear to elegant evening attire, we offer a curated selection of
          fashion that fits your unique style and personality.
        </p>

        <p className="md:text-lg text-gray-700 dark:text-gray-300 mb-6 text-xs text-center">
          Our mission is simple: to empower you to express yourself through
          fashion, while providing high-quality, affordable pieces that you'll
          love wearing.
        </p>

        <div className="border-t border-gray-300 my-8"></div>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 underline">
          Our Mission
        </h2>
        <blockquote className="italic md:text-lg text-xs text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-blue-500 pl-4">
          "To create a shopping experience that inspires confidence, creativity,
          and self-expression through fashion."
        </blockquote>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Why Shop With Us?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
          {features.map((feature, index) => (
            <div
              className="flex items-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition-shadow"
              key={index}
            >
              <span className="md:text-2xl text-md text-blue-500 dark:text-blue-400 mr-3">
                ✔
              </span>
              <p className="md:text-lg text-xs">{feature}</p>
            </div>
          ))}
        </div>

        <p className="md:text-lg text-xs text-gray-700 dark:text-gray-300 mt-8 text-center">
          Join the{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">
            VAGO
          </span>{" "}
          community today, and start shopping the latest styles that reflect
          your personality and confidence. We can’t wait to be a part of your
          fashion journey!
        </p>
        <div className="flex flex-col items-center gap-6 mt-10">
          <a
            href="https://vago-chat-app.onrender.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-white transition-all ease-in-out duration-300 bg-gradient-to-r from-blue-400 to-blue-600 py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12.5a1 1 0 10-2 0v3.85l2.44 2.44a1 1 0 001.42-1.42l-2.85-2.85V5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Join the Community
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
