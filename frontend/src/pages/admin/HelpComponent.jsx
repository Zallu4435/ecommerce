import { useState } from "react";

const HelpComponent = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I manage users in the admin panel?",
      answer: "Navigate to the 'User Management' section in the admin panel to view, edit, or delete user accounts.",
    },
    {
      question: "How can I manage products?",
      answer: "In the 'Products Management' section, you can add, edit, or delete products.",
    },
    {
      question: "How can I generate sales reports?",
      answer: "In the 'Sales Management' section, you can generate sales reports by selecting a date range and clicking 'Generate Report'.",
    },
    {
      question: "How do I manage categories?",
      answer: "In the 'Category Management' section, you can manage product categories including adding, editing, or deleting them.",
    },
    {
      question: "How do I apply discount coupons?",
      answer: "In the 'Coupons Management' section, you can create, edit, or activate discount coupons for users.",
    },
    {
      question: "How do I handle order management?",
      answer: "In the 'Orders Management' section, you can view, process, and update customer orders.",
    },
  ];

  const contactInfo = {
    phone: "+1 (123) 456-7890", 
    email: "support@example.com",
    hours: "Monday - Friday: 9 AM - 5 PM",
  };

  return (
    <div className="dark:bg-gray-900 bg-orange-50 mt-10 min-h-screen flex items-center justify-center p-5">
      <div className="dark:bg-gray-800 bg-yellow-50 shadow-lg rounded-lg p-8 max-w-5xl w-full">
        <h1 className="dark:text-blue-400 text-blue-600 text-3xl font-bold text-center mb-6">
          Help Center
        </h1>
        <p className="dark:text-gray-400 text-gray-600 text-center mb-8">
          Need assistance? Browse through our FAQs or contact support.
        </p>

        <div>
          {faqs.map((faq, index) => (
            <div className="mb-4" key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="dark:bg-gray-700 bg-gray-200 dark:text-gray-200 text-gray-800 w-full flex justify-between items-center text-lg font-medium px-4 py-3 rounded-lg focus:outline-none"
              >
                {faq.question}
                <span>{openFAQ === index ? "-" : "+"}</span>
              </button>
              {openFAQ === index && (
                <div className="dark:bg-gray-600 bg-gray-50 dark:text-gray-300 text-gray-700 mt-2 p-4 rounded-lg">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <h3 className="dark:text-blue-400 text-blue-600 text-2xl font-semibold mb-3">
            Still need help?
          </h3>
          <p className="dark:text-gray-400 text-gray-600 mb-5">
            Contact our support team for further assistance.
          </p>
          <div className="dark:bg-blue-500 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md">
            📞 Contact Support: {contactInfo.phone}
          </div>
          <div className="dark:text-gray-400 text-gray-600 mt-4">
            📧 Email: {contactInfo.email}
          </div>
          <div className="dark:text-gray-400 text-gray-600 mt-2">
            🕒 Support Hours: {contactInfo.hours}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpComponent;
