import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsStars } from "react-icons/bs";

const HeroSection_4 = () => {
  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 3000,
    cssEase: "linear",
    arrows: false,
    dots: false,
    swipe: true,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          speed: 2000,
        },
      },
    ],
  };

  const arr = [
    "Spring Collection",
    "Hot Deal Products",
    "T-Shirt Offer",
    "Limited Offer Sale",
    "Our Services",
  ];

  return (
    <div className="relative w-full dark:bg-gray-800 bg-gray-100 py-10 shadow-lg dark:shadow-md">
      <Slider {...settings}>
        {arr.map((slide, index) => (
          <div
            key={index}
            className="px-4 sm:px-6 md:px-8 lg:px-10 whitespace-nowrap"
          >
            {" "}
            <h1 className="flex items-center tracking-wide text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold gap-10 sm:gap-20 md:gap-30 lg:gap-44 dark:text-white text-gray-800">
              {slide}
              <BsStars className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            </h1>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection_4;
