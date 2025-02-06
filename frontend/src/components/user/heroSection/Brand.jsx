import { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import {
  brandImg_1,
  brandImg_2,
  brandImg_3,
  brandImg_4,
  brandImg_5,
  brandImg_6,
  brandImg_7,
  brandImg_8,
} from "../../../assets/images/index";

const FashionBrandSlider = () => {
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    autoplay: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    speed: 500,
    cssEase: "linear",
    prevArrow: (
      <FaChevronLeft className="text-4xl text-gray-800 dark:text-gray-200 cursor-pointer" />
    ),
    nextArrow: (
      <FaChevronRight className="text-4xl text-gray-800 dark:text-gray-200 cursor-pointer" />
    ),
    responsive: [
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
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const brands = [
    { image: brandImg_1, link: "https://www.brand1.com", alt: "Brand 1" },
    { image: brandImg_2, link: "https://www.brand2.com", alt: "Brand 2" },
    { image: brandImg_3, link: "https://www.brand3.com", alt: "Brand 3" },
    { image: brandImg_4, link: "https://www.brand4.com", alt: "Brand 4" },
    { image: brandImg_5, link: "https://www.brand5.com", alt: "Brand 5" },
    { image: brandImg_6, link: "https://www.brand6.com", alt: "Brand 6" },
    { image: brandImg_7, link: "https://www.brand7.com", alt: "Brand 7" },
    { image: brandImg_8, link: "https://www.brand8.com", alt: "Brand 8" },
  ];

  return (
    <div className="relative border-2 space-y-10 border-gray-400 dark:border-gray-600 mx-4 md:mx-10 lg:mx-16 xl:mx-24 rounded-lg shadow-lg overflow-hidden p-4 dark:bg-gray-800 bg-white">
      <div className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-gray-200 font-semibold absolute left-8 top-4">
        TOP BRANDS
      </div>

      <div className="absolute lg:top-0 lg:right-14 md:right-[30px] top-[-20px] right-[10px] z-10">
        <FaChevronRight
          className="text-3xl sm:text-4xl lg:text-5xl text-gray-800 dark:text-gray-200 cursor-pointer p-2 md:p-3 border-2 border-gray-800 dark:border-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          onClick={() => sliderRef.current.slickNext()}
        />
      </div>

      <div className="absolute lg:top-0 lg:right-28 top-[-20px] right-[50px] md:right-20 z-10">
        <FaChevronLeft
          className="text-3xl sm:text-4xl lg:text-5xl text-gray-800 dark:text-gray-200 cursor-pointer p-2 md:p-3 border-2 border-gray-800 dark:border-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          onClick={() => sliderRef.current.slickPrev()}
        />
      </div>

      <Slider {...settings} ref={sliderRef}>
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex justify-center items-center mx-4 sm:mx-6 md:mx-8 lg:mx-10 my-4"
          >
            <a href={brand.link} target="_blank" rel="noopener noreferrer">
              <img
                src={brand.image}
                alt={brand.alt}
                className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto object-contain p-4 transition-transform duration-300 hover:scale-110"
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FashionBrandSlider;
