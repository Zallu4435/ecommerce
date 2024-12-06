import React from 'react';
import Slider from 'react-slick';
import { FaInstagram } from 'react-icons/fa'; // Import Instagram icon
import { instaImg_1, instaImg_2, instaImg_3, instaImg_4 } from '../../../assets/images';

const HeroSection_5 = () => {
  const slides = [
    { image: instaImg_1, link: 'https://www.instagram.com/yourpage' },
    { image: instaImg_2, link: 'https://www.instagram.com/yourpage' },
    { image: instaImg_3, link: 'https://www.instagram.com/yourpage' },
    { image: instaImg_4, link: 'https://www.instagram.com/yourpage' },
  ];

  const settings = {
    infinite: true, // Infinite loop
    autoplay: true, // Autoplay
    autoplaySpeed: 2000, // Time for each slide
    slidesToShow: 4, // Number of slides visible at once
    slidesToScroll: 1, // Number of slides to scroll
    speed: 500, // Transition speed
    cssEase: 'linear',
    centerMode: true, // Centers the images
    focusOnSelect: true, // Allows selection of slides
    centerPadding: '0', // Removes the padding on the center
    responsive: [
      {
        breakpoint: 1024, // For large screens
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // For tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // For mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="overflow-hidden shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)]">
      <div className="ml-5 sm:space-y-2 mb-2 sm:mb-0">
        <h1 className="font-medium text-2xl sm:text-3xl md:text-4xl">INSTAGRAM</h1>
        <h1 className="text-sm sm:text-lg md:text-xl text-gray-500">Get inspired by Indian fans all over the world</h1>
      </div>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="p-1 sm:p-2 md:p-3 h-[300px] sm:h-[300px] md:h-[400px] relative">
            <img
              src={slide.image}
              alt="Instagram"
              className="w-full h-full px-3 sm:px-0 object-cover"
            />
            {/* Instagram icon placed in the center with improved visibility */}
            <a href={slide.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 p-2 sm:p-3 md:p-4 rounded-full">
                <FaInstagram className="text-white text-3xl sm:text-4xl md:text-5xl opacity-100 hover:opacity-90 transition-opacity duration-300" />
              </div>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection_5;
