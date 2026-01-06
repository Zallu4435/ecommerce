import { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SiNike, SiAdidas, SiPuma, SiUnderarmour, SiNewbalance, SiFila, SiJordan, SiReebok } from "react-icons/si";

const FashionBrandSlider = () => {
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 6,
    slidesToScroll: 1,
    speed: 500,
    cssEase: "ease-out",
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  const brands = [
    { Icon: SiNike, name: "Nike" },
    { Icon: SiAdidas, name: "Adidas" },
    { Icon: SiPuma, name: "Puma" },
    { Icon: SiUnderarmour, name: "Under Armour" },
    { Icon: SiNewbalance, name: "New Balance" },
    { Icon: SiFila, name: "Fila" },
    { Icon: SiJordan, name: "Jordan" },
    { Icon: SiReebok, name: "Reebok" },
  ];

  return (
    <div className="relative py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm dark:shadow-none p-8 mx-auto overflow-hidden bg-gray-50 dark:bg-gray-800/50">
        <div className="flex justify-between items-center mb-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Top Brands
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-200 transition-all active:scale-95"
              aria-label="Previous brand"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-200 transition-all active:scale-95"
              aria-label="Next brand"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4">
          <Slider {...settings} ref={sliderRef}>
            {brands.map((brand, index) => (
              <div key={index} className="px-4 py-6 outline-none">
                <div className="flex flex-col items-center justify-center group cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                  <brand.Icon
                    className="w-16 h-16 md:w-20 md:h-20 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 drop-shadow-sm"
                  />
                  <span className="mt-4 text-sm font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    {brand.name}
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default FashionBrandSlider;
