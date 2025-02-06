import { FaShoppingCart } from "react-icons/fa";
import { MdArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { heroImg_1, heroImg_2, heroImg_3 } from "../../../assets/images";

const HeroSection_1 = () => {
  const slides = [
    {
      image: heroImg_1,
      title: "UP TO 50% OFF",
      subtitle: "New Styles Just For You",
      description:
        "You appear ordinary if you dress simply. We are here to help you look extraordinary.",
      buttonText: "Shop Now",
    },
    {
      image: heroImg_2,
      title: "SUMMER COLLECTION",
      subtitle: "Feel the Heat in Style",
      description: "Explore the best summer outfits to stay cool and trendy.",
      buttonText: "Discover Now",
    },
    {
      image: heroImg_3,
      title: "WINTER IS HERE",
      subtitle: "Stay Warm, Stay Stylish",
      description: "Stay cozy in our new winter collection.",
      buttonText: "Shop Winter",
    },
  ];

  return (
    <div className="relative w-full bg-gray-900">
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={3000}
        transitionTime={500}
        swipeable={true}
        showStatus={false}
        className="text-white"
        axis="horizontal"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              className="absolute top-1/2 left-4 md:left-8 z-10 transform -translate-y-1/2 bg-gray-800 p-2 md:p-4 rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100 transition-all"
            >
              <MdOutlineArrowBackIos className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              className="absolute top-1/2 right-4 md:right-8 z-10 transform -translate-y-1/2 bg-gray-800 p-2 md:p-4 rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100 transition-all"
            >
              <MdArrowForwardIos className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          )
        }
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-800 dark:text-white text-gray-700 shadow-lg"
          >
            <div className="w-full md:w-1/2 text-center md:text-left p-4 md:p-8 lg:p-16">
              <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 md:mb-4">
                {slide.title}
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-2 md:mb-6">
                {slide.subtitle}
              </h2>
              <p className="text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-4 md:mb-8">
                {slide.description}
              </p>
              <div className="flex justify-center md:justify-start">
                <button className="flex items-center justify-center gap-2 border py-3 px-6 md:py-4 md:px-8 text-sm md:text-lg lg:text-xl rounded-full transition-all font-medium dark:hover:bg-orange-50 hover:bg-gray-900 hover:text-white dark:hover:text-gray-700">
                  {slide.buttonText}
                  <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={slide.image}
                alt="Fashion style"
                className="object-contain h-64 md:h-96 lg:h-[650px] shadow-[0_0_20px_10px_rgba(0.1)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.01)]"
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSection_1;
