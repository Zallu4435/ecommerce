import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Sparkles, Zap, Tag, Truck } from "lucide-react";

const HeroSection_4 = () => {
  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0, // Continuous scrolling
    speed: 6000,      // Slower, smoother speed
    cssEase: "linear",
    variableWidth: true, // Allows items to take natural width
    arrows: false,
    dots: false,
    pauseOnHover: false,
    slidesToShow: 1,  // Not used with variableWidth but required
  };

  const offers = [
    { text: "SEASONAL SALE IS LIVE", icon: Zap },
    { text: "FREE SHIPPING ON ORDERS OVER $100", icon: Truck },
    { text: "NEW ARRIVALS DAILY", icon: Sparkles },
    { text: "LIMITED TIME OFFERS", icon: Tag },
    { text: "PREMIUM QUALITY GUARANTEED", icon: Sparkles },
  ];

  return (
    <div className="relative w-full bg-black text-white py-6 overflow-hidden border-y border-gray-800">
      <Slider {...settings} className="marquee-slider">
        {/* Duplicate content to ensure seamless loop if needed, though react-slick handles infinite */}
        {[...offers, ...offers, ...offers].map((offer, index) => (
          <div key={index} className="flex items-center px-12 focus:outline-none">
            <div className="flex items-center gap-4 group cursor-default">
              <offer.icon className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-xl md:text-2xl font-bold tracking-widest uppercase italic">
                {offer.text}
              </span>
              <div className="w-2 h-2 rounded-full bg-gray-600 ml-12"></div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection_4;
