import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetPopularCategoriesQuery } from "../../../redux/apiSliceFeatures/categoryApiSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";
import { FaArrowRight } from "react-icons/fa6"; // Standard FontAwesome icon

const HeroSection_3 = () => {
  const navigate = useNavigate();

  const {
    data: popular_data,
    isLoading,
    isError,
  } = useGetPopularCategoriesQuery();

  const handleProductClick = (_id) => navigate(`/product/${_id}`);

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 600,
    cssEase: "ease-out",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1536,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, centerMode: false },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: '40px' },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return null;
  }

  // The API returns { success: true, products: [...] }
  const products = popular_data?.products || [];
  const hasProducts = Array.isArray(products) && products.length > 0;

  if (!hasProducts) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Trending Styles
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg">
              Curated picks from our most popular collections.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
          >
            View All Collection <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative -mx-4 pb-10">
          <Slider {...settings} className="trending-slider">
            {products.map((product, index) => (
              <div key={index} className="px-4">
                <div
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-[350px]"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="w-full h-full relative">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md line-clamp-1">
                        {product.productName}
                      </h3>
                      <button className="text-sm font-medium text-white/90 group-hover:text-white flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        Shop Now <FaArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-semibold shadow-sm w-full max-w-xs mx-auto"
          >
            View All Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection_3;
