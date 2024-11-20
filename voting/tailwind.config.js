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
      boxShadow: {
        'custom-semibold': '0px 0px 60px rgba(41, 198, 65, 0.5)',
        'custom-bold': '0px 0px 70px rgba(41, 198, 65, 0.5)',
        'custom-semibold-yellow': '0px 0px 60px rgba(250, 194, 25, 0.5)',
        'custom-bold-yellow': '0px 0px 70px rgba(250, 194, 25, 0.5)',
        'custom-semibold-tjan': '0px 0px 60px rgba(255, 211, 51, 0.5)',
        'custom-semibold-kenjih': '0px 0px 60px rgba(250, 72, 52, 0.5)'
      }
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