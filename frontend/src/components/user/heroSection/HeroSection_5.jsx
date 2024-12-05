import React from 'react';
import { instaImg_1, instaImg_2, instaImg_3, instaImg_4 } from '../../../assets/images';
import Slider from 'react-slick';
import { FaInstagram } from 'react-icons/fa'; // Import Instagram icon

const HeroSection_5 = () => {

    const slides = [
        { image: instaImg_1, link: "https://www.instagram.com/yourpage" },
        { image: instaImg_2, link: "https://www.instagram.com/yourpage" },
        { image: instaImg_3, link: "https://www.instagram.com/yourpage" },
        { image: instaImg_4, link: "https://www.instagram.com/yourpage" },
    ];

    const settings = {
        infinite: true, // Infinite loop
        autoplay: true, // Autoplay
        autoplaySpeed: 2000, // Time for each slide
        slidesToShow: 4, // Number of slides visible at once
        slidesToScroll: 1, // Number of slides to scroll
        speed: 500, // Transition speed
        cssEase: "linear",
        centerMode: true, // Centers the images
        focusOnSelect: true, // Allows selection of slides
        centerPadding: '0', // Removes the padding on the center
    };

    return (
        <div className="overflow-hidden">
            <div className='ml-5 space-y-2'>
                <h1 className='font-medium text-5xl'>INSTAGRAM</h1>
                <h1 className='text-xl font-medium text-gray-500'>Get inspired by Indian fans all over the world</h1>
            </div>
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="p-5 h-[500px] relative">
                        <img
                            src={slide.image}
                            alt="image"
                            className="w-full h-full object-cover"
                        />
                        {/* Instagram icon placed in the center with improved visibility */}
                        <a href={slide.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 p-4 rounded-full">
                                <FaInstagram className="text-white text-6xl opacity-100 hover:opacity-90 transition-opacity duration-300" />
                            </div>
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default HeroSection_5;
