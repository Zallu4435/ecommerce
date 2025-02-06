/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      transitionProperty: {
        transform: "transform",
      },
      scale: {
        105: "1.05",
        110: "1.10",
      },

      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        playfair: ["'Playfair Display'", "serif"],
        poppins: ["'Poppins'", "sans-serif"],
        exo: ["Exo", "sans-serif"], // Futuristic and wide
      },

      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  variants: {
    extend: {
      scale: ["hover", "focus"],
      transform: ["hover", "focus"],
    },
    scrollbar: ['rounded']
  },
  safelist: [
    "text-white",
    "text-black",
    "text-red-500",
    "text-green-500",
    "text-yellow-500",
    "text-blue-500",
    "text-red-600",
    "text-green-600",
    "text-blue-600",
    "hover:scale-105",
    "transition-transform",
    "duration-300",
  ],
  plugins: [
    scrollbarHide
  ],
};
