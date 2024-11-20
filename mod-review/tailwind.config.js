/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xms: "435px",
      xls: "530px",
      xss: "660px",
      xs: "750px",
      ss: "860px",
      sm: "960px",
      md: "1050px",
      lg: "1230px",
      lx: "1530px",
      xl: "1700px",
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.transition-custom-all': {
          transition: 'all 0.2s ease',
        },
        '.transition-custom-border': {
          transition: 'border 0.15s ease, border-color 0.15s ease',
        },
        '.font-sf-pro': {
          fontFamily: 'SF Pro Display, sans-serif',
        },
        '.font-inter-semibold': {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
        },
        '.font-inter-regular': {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
        },
        '.font-inter-medium': {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        },
        '.font-inter-light': {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
        },
        '.font-inter-bold': {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};