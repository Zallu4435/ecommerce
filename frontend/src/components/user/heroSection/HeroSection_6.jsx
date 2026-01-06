import { Truck, ShieldCheck, CreditCard, Headphones, RefreshCw } from "lucide-react";

const HeroSection_6 = () => {
  const sections = [
    {
      title: "Free Shipping",
      description: "On all orders over $99",
      Icon: Truck,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Secure Payment",
      description: "100% secure payment methods",
      Icon: ShieldCheck,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "30 Day Returns",
      description: "Easy returns & exchanges",
      Icon: RefreshCw,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "24/7 Support",
      description: "Dedicated customer support",
      Icon: Headphones,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex items-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`p-4 rounded-xl mr-5 ${section.color} transition-transform duration-300 group-hover:scale-110`}>
                <section.Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection_6;
