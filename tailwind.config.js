/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "310px",
      },
      keyframes: {
        slideTop: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100px)" },
        },
      },
      animation: {
        "slide-top":
          "slideTop 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
      colors: {
        primary: "#007E85",
        success: "#6EAB36",
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
