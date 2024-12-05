import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Images imports
import { 
  roundedImg_1, 
  roundedImg_10, 
  roundedImg_11, 
  roundedImg_2, 
  roundedImg_3, 
  roundedImg_4, 
  roundedImg_5, 
  roundedImg_6, 
  roundedImg_7, 
  roundedImg_8, 
  roundedImg_9 
} from "../../../assets/images";

const HeroSection_3 = () => {
  const slides = [
    { image: roundedImg_1, text: "Men's Fashion" },
    { image: roundedImg_2, text: "Women's Fashion" },
    { image: roundedImg_3, text: "Kids' Fashion" },
    { image: roundedImg_4, text: "Sportswear" },
    { image: roundedImg_5, text: "Accessories" },
    { image: roundedImg_6, text: "Winter Collection" },
    { image: roundedImg_7, text: "Summer Collection" },
    { image: roundedImg_8, text: "Formal Wear" },
    { image: roundedImg_9, text: "Casual Wear" },
    { image: roundedImg_10, text: "Luxury Wear" },
    { image: roundedImg_11, text: "Trending Now" },
  ];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 500,
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
    <div>
      <h1 className="lg:text-5xl text-2xl md:text-3xl font-medium text-center lg:font-bold lg:mb-7 text-responsive">Popular Categories</h1>

      <div className="hero-section relative w-full py-10 overflow-x-hidden">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide flex flex-col items-center mx-2">
              {/* Image Container with responsive size */}
              <div className="w-[120px] h-[120px] xl:ml-16 sm:w-[150px] sm:h-[150px] ml-7 md:ml-4 md:w-[200px] lg:ml-0 md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-gray-700 mb-4">
                <img
                  src={slide.image}
                  alt={slide.text}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Text Below Image */}
              <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white">{slide.text}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroSection_3;
