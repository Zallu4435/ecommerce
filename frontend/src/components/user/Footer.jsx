import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 py-12 shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Us Section */}
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              About Us
            </h4>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              We are a leading fashion destination offering the latest trends in
              men's, women's, and children's fashion. Shop with us to find your
              style and get the best deals on new arrivals and seasonal sales.
            </p>
          </div>

          {/* Customer Service Section */}
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Contact Us</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Return Policy</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Shipping Info</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">FAQ</a></li>
            </ul>
          </div>

          {/* Fashion Categories Section */}
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Shop by Category
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Men's Fashion</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Women's Fashion</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Children's Fashion</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">New Arrivals</a></li>
              <li><a href="#" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Sale</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Follow Us
            </h4>
            <div className="flex space-x-6 text-xl sm:text-2xl md:text-3xl">
              <a
                href="https://www.facebook.com/YourPage" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors duration-300"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com/YourProfile" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/YourProfile" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors duration-300"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.youtube.com/channel/YourChannel" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors duration-300"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center mt-12">
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
