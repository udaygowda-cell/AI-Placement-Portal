/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dce6ff",
          200: "#b9cdff",
          300: "#85a6ff",
          400: "#4d75ff",
          500: "#1a44ff",
          600: "#0025f5",
          700: "#001de0",
          800: "#0018b6",
          900: "#00168f",
        },
        accent: {
          DEFAULT: "#00f5a0",
          dark: "#00c880",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          800: "#111118",
          700: "#1a1a24",
          600: "#24242f",
          500: "#2d2d3d",
          400: "#3d3d52",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s infinite",
        gradient: "gradient 6s ease infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        gradient: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};
