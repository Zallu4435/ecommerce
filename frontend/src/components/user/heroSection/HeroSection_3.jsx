import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useGetPopularCategoriesQuery } from "../../../redux/apiSliceFeatures/categoryApiSlice";
import { useNavigate } from "react-router-dom";

const HeroSection_3 = () => {
  const navigate = useNavigate();

  const { data: popular_categories } = useGetPopularCategoriesQuery();

  const handleImageClick = (_id) => navigate(`/product/${_id}`);

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 100,
    centerMode: true,
    centerPadding: "0",
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="pt-16 bg-gray-50 dark:bg-gray-800 bg-gradient-to-b from-gray-100 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:shadow-none">
      <h1 className="mt-8 lg:text-5xl text-2xl md:text-3xl font-medium text-center lg:font-bold lg:mb-7 text-gray-900 dark:text-gray-100">
        Popular Categories
      </h1>

      <div className="hero-section relative w-full py-10 overflow-x-hidden">
        <Slider {...settings}>
          {popular_categories?.products?.map((slide, index) => (
            <div key={index} className="slide flex flex-col items-center mx-2">
              <div className="w-[120px] bg-white dark:bg-gray-800 h-[120px] xl:ml-16 sm:w-[150px] sm:h-[150px] ml-7 md:ml-4 md:w-[200px] lg:ml-0 md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full overflow-hidden flex items-center justify-center border-4 border-gray-700 mb-4 shadow-[0_0_15px_15px_rgba(255,255,255,1)] dark:shadow-[0_0_15px_15px_rgba(0,0,0,0.6)]">
                <img
                  src={slide.image}
                  alt={slide.text}
                  className="object-cover"
                  onClick={() => handleImageClick(slide._id)}
                />
              </div>
              <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-900 dark:text-gray-100">
                {slide.productName}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroSection_3;
