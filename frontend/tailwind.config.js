/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables dark mode based on a CSS class
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
        // Add custom transitions for smoother effects
        transform: "transform",
      },
      scale: {
        // Extend scale options for hover effects
        105: "1.05",
        110: "1.10",
      },
    },
  },
  variants: {
    extend: {
      // Enable hover and focus states for scale and transform
      scale: ["hover", "focus"],
      transform: ["hover", "focus"],
    },
  },
  safelist: [
    // Safelist colors for dynamic class generation
    "text-white", 
    "text-black", 
    "text-red-500", 
    "text-green-500", 
    "text-yellow-500", 
    "text-blue-500",
    "text-red-600", 
    "text-green-600", 
    "text-blue-600",
    'hover:scale-105',
    'transition-transform',
    'duration-300',
  ],
  plugins: [],
};
