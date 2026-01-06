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

      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-gray-900 dark:text-white tracking-tight">
            Most Popular
          </h2>
          <CardContainer />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-3 block">From The Blog</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Latest Fashion Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Explore tips, updates, and more. Stay connected with the latest trends in our weekly editorial.
          </p>
          <a
            href="https://vago-blog-app.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Read Our Blog
          </a>
        </div>
      </section>

      <Brand />

      <HeroSection_6 />

      <HeroSection_5 />
    </div>
  );
};

export default Home;
