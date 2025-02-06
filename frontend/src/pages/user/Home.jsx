import HeroSection_1 from "../../components/user/heroSection/HeroSection_1";
import HeroSection_3 from "../../components/user/heroSection/HeroSection_3";
import HeroSection_4 from "../../components/user/heroSection/HeroSection_4";
import CardContainer from "../../components/user/CardContainer";
import Brand from "../../components/user/heroSection/Brand";
import HeroSection_6 from "../../components/user/heroSection/HeroSection_6";
import HeroSection_5 from "../../components/user/heroSection/HeroSection_5";

const Home = () => {
  return (
    <div className="space-y-16 mb-14 md:space-y-24 lg:space-y-32 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <HeroSection_1 />

      <HeroSection_3 />

      <HeroSection_4 />

      <div className="p-4 bg-gray-100 dark:bg-gray-800 shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)]">
        <h1 className="font-bold text-2xl mt-10 sm:text-3xl md:text-4xl lg:text-5xl mb-7 text-center md:text-left text-gray-800 dark:text-white">
          Popular Products
        </h1>
        <CardContainer />
      </div>

      {/* Blog Section */}
      <div className="p-6 rounded-lg shadow-lg text-center transition-colors duration-300 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700 dark:text-gray-100">
          Discover More on Our Blog!
        </h2>
        <p className="md:text-lg text-xs mb-6 text-gray-600 dark:text-gray-300">
          Explore tips, updates, and more. Stay connected with the latest trends
          in our blog!
        </p>
        <a
          href="https://vago-blog-app.onrender.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
        >
          Visit Our Blog
        </a>
      </div>

      <Brand />

      <HeroSection_6 />

      <HeroSection_5 />
    </div>
  );
};

export default Home;
