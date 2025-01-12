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

      <Brand />

      <HeroSection_6 />

      <HeroSection_5 />
    </div>
  );
};

export default Home;
