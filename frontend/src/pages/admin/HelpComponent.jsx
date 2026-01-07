import { useState, useMemo } from "react";
import {
  Search,
  HelpCircle,
  UserCog,
  Package,
  ShoppingCart,
  Tags,
  BarChart3,
  MessageSquare,
  Plus,
  Minus,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const HelpComponent = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 'users', name: 'User Management', icon: <UserCog className="w-6 h-6" />, count: 12, color: 'bg-blue-500' },
    { id: 'products', name: 'Products & Inventory', icon: <Package className="w-6 h-6" />, count: 18, color: 'bg-purple-500' },
    { id: 'orders', name: 'Order Processing', icon: <ShoppingCart className="w-6 h-6" />, count: 15, color: 'bg-green-500' },
    { id: 'marketing', name: 'Coupons & Marketing', icon: <Tags className="w-6 h-6" />, count: 9, color: 'bg-orange-500' },
    { id: 'analytics', name: 'Sales & Analytics', icon: <BarChart3 className="w-6 h-6" />, count: 11, color: 'bg-rose-500' },
    { id: 'reviews', name: 'Review Moderation', icon: <MessageSquare className="w-6 h-6" />, count: 7, color: 'bg-indigo-500' },
  ];

  const faqs = [
    {
      question: "How do I manage users in the admin panel?",
      answer: "Navigate to the 'User Management' section in the sidebar. Here you can search for users, view their detailed profiles, and perform administrative actions like blocking/unblocking or editing their information.",
      category: 'users'
    },
    {
      question: "How can I add a new product variant?",
      answer: "Go to 'Products Management', click on the 'Add Product' button or edit an existing one. Look for the 'Variants' section where you can specify sizes, colors, and stock for different versions of the same product.",
      category: 'products'
    },
    {
      question: "How do I process a refund for a returned order?",
      answer: "Locate the specific order in 'Order Management'. Once the return is approved and received, you can use the 'Refund' button within the order details page to credit the customer's wallet or original payment method.",
      category: 'orders'
    },
    {
      question: "Can I schedule a coupon for a future date?",
      answer: "Yes, when creating a coupon in the 'Coupons Management' section, set the 'Start Date' to a future timestamp. The coupon will automatically become active when that time arrives.",
      category: 'marketing'
    },
    {
      question: "How are the analytics reports calculated?",
      answer: "Sales management reports aggregate data from delivered orders. You can filter by daily, weekly, or monthly periods and even specific categories to see performance trends.",
      category: 'analytics'
    },
    {
      question: "How do I moderate customer reviews?",
      answer: "In 'Review Management', you can view all incoming ratings and reviews. You have the ability to delete reviews that violate community guidelines or contain spam. You can also search for reviews using the customer's name, email, the product name, or even by a specific star rating (1-5).",
      category: 'reviews'
    },
  ];

  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return faqs;
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="flex dark:bg-black h-screen fixed top-10 left-[420px] right-0">
      <div className="p-6 w-full px-14 dark:bg-gray-900 dark:text-white bg-orange-50 overflow-y-auto scrollbar-hidden pb-20">
        {/* Page Header */}
        <div className="flex justify-between mt-5 items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-400">
            Help & Support
          </h1>
          <div className="relative group w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search help topics..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-gray-100 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all cursor-pointer shadow-sm"
            >
              <div className={`${cat.color} w-12 h-12 rounded-lg text-white flex items-center justify-center mb-4 shadow-md`}>
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{cat.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed guides on managing {cat.name.toLowerCase()} efficiently.
              </p>
            </div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left outline-none"
                  >
                    <span className={`font-semibold ${openFAQ === index ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
                      {faq.question}
                    </span>
                    <span className="text-gray-400">
                      {openFAQ === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">No matching search results.</p>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-400 mb-6">Need Further Assistance?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Us</p>
                  <p className="font-semibold text-gray-800 dark:text-white">support@zallu.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Call Us</p>
                  <p className="font-semibold text-gray-800 dark:text-white">+1 (123) 456-7890</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-gray-100 dark:border-gray-700 pl-8">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Hours</p>
                <p className="font-semibold text-gray-800 dark:text-white">Mon - Fri: 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpComponent;
