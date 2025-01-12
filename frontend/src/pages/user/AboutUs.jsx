import { aboutUsImg } from "../../assets/images";

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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center md:py-10">
      <div className="w-full sm:w-3/4 lg:w-2/3 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
          About Us
        </h1>

        <div className="flex justify-center mb-8">
          <img
            src={aboutUsImg}
            alt="Fashion Store"
            className="md:w-80 md:h-80 w-60 h-60 object-cover rounded-full shadow-xl"
          />
        </div>

        <p className="md:text-lg text-gray-700 dark:text-gray-300 mb-6 text-xs text-center">
          Welcome to{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">
            [Your Fashion Store Name]
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

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Our Mission
        </h2>
        <blockquote className="italic md:text-lg text-xs text-gray-700 dark:text-gray-300 mb-6">
          "To create a shopping experience that inspires confidence, creativity,
          and self-expression through fashion."
        </blockquote>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Why Shop With Us?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
          {features.map((feature, index) => (
            <div className="flex items-center" key={index}>
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
            [Your Fashion Store Name]
          </span>{" "}
          community today, and start shopping the latest styles that reflect
          your personality and confidence. We can’t wait to be a part of your
          fashion journey!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
