import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { logoLight, logoDark } from "../../assets/images/index";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                VAGO<span className="text-blue-600">.</span>
              </span>
              {/* Or stick to images if preferred, but text is cleaner for footer sometimes */}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Your premier destination for contemporary fashion. We bring you the latest trends with uncompromising quality and style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:text-blue-400 dropdown-hover:text-blue-300 transition-colors">
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <Youtube className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/shop?category=Men" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Women" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Child" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Kids' Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?sortBy=newest" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  123 Fashion Street, <br />
                  New York, NY 10012
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  support@vago.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} VAGO E-Commerce. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
