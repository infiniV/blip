import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'bg-slide': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'color-change': {
          '0%': { backgroundColor: '#ff7e5f' },
          '50%': { backgroundColor: '#feb47b' },
          '100%': { backgroundColor: '#ff7e5f' },
        },
        'border-color-change': {
          '0%': { borderColor: '#ff7e5f' },
          '50%': { borderColor: '#feb47b' },
          '100%': { borderColor: '#ff7e5f' },
        },
      },
      animation: {
        'bg-slide': 'bg-slide 15s ease infinite',
        'color-change': 'color-change 5s ease infinite',
        'border-color-change': 'border-color-change 5s ease infinite animate-spin',
      },
    },
  },
  plugins: [],
};

export default config;
