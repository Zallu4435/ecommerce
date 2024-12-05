import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About Us Section */}
            <div>
                <h4 className="text-3xl font-bold mb-4">About Us</h4>
                <p className="text-lg text-gray-400">
                We are a leading fashion destination offering the latest trends in
                men's, women's, and children's fashion. Shop with us to find your
                style and get the best deals on new arrivals and seasonal sales.
                </p>
            </div>

            {/* Customer Service Section */}
            <div>
                <h4 className="text-3xl font-bold mb-4">Customer Service</h4>
                <ul className="space-y-3">
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Return Policy</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
            </div>

            {/* Fashion Categories Section */}
            <div>
                <h4 className="text-3xl font-bold mb-4">Shop by Category</h4>
                <ul className="space-y-3">
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Men's Fashion</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Women's Fashion</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Children's Fashion</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">New Arrivals</a></li>
                <li><a href="#" className="text-lg text-gray-400 hover:text-white">Sale</a></li>
                </ul>
            </div>

            {/* Social Media Section */}
            <div>
                <h4 className="text-3xl font-bold mb-4">Follow Us</h4>
                <div className="flex space-x-6 text-3xl">
                    <a
                    href="https://www.facebook.com/YourPage" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600"
                    >
                    <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                    href="https://twitter.com/YourProfile" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400"
                    >
                    <i className="fab fa-twitter"></i>
                    </a>
                    <a
                    href="https://www.instagram.com/YourProfile" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500"
                    >
                    <i className="fab fa-instagram"></i>
                    </a>
                    <a
                    href="https://www.youtube.com/channel/YourChannel" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-600"
                    >
                    <i className="fab fa-youtube"></i>
                    </a>
                </div>
        </div>

        </div>

        {/* Bottom Copyright */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-400">
            &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
