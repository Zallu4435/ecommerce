import Slider from "react-slick";
import { Instagram } from "lucide-react";
import {
  instaImg_1,
  instaImg_2,
  instaImg_3,
  instaImg_4,
} from "../../../assets/images";

const HeroSection_5 = () => {
  // Use images twice to create a longer loop if array is short
  const slides = [
    { image: instaImg_1, link: "https://www.instagram.com" },
    { image: instaImg_2, link: "https://www.instagram.com" },
    { image: instaImg_3, link: "https://www.instagram.com" },
    { image: instaImg_4, link: "https://www.instagram.com" },
    { image: instaImg_1, link: "https://www.instagram.com" },
  ];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 800,
    cssEase: "ease-in-out",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-pink-600 dark:text-pink-400">
          <Instagram className="w-6 h-6" />
          <span className="font-bold tracking-wider text-sm uppercase">Follow Us On Instagram</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          @E-CommerceStyle
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Tag us in your photos to be featured in our monthly lookbook.
        </p>
      </div>

      <div className="relative">
        <Slider {...settings} className="instagram-slider">
          {slides.map((slide, index) => (
            <div key={index} className="px-2">
              <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group overflow-hidden rounded-2xl aspect-square cursor-pointer"
              >
                <img
                  src={slide.image}
                  alt="Instagram post"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <Instagram className="w-10 h-10 text-white transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default HeroSection_5;
