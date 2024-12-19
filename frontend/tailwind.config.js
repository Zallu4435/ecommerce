/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
    },
  },
  safelist: [
    'text-white', 'text-black', 'text-red-500', 'text-green-500', 'text-yellow-500', 'text-blue-500',
    'text-red-600', 'text-green-600', 'text-blue-600', // Add variations if needed
  ],
  
  plugins: [],
}