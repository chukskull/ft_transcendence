import { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "/goinfre/snagat/testing/sure/frontend/app/(ClientLogin)/fill/page.tsx",
    "./node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js",
    "./node_modules/@nextui-org/theme/dist/components/input.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ClashGrotesk-Variable': ['ClashGrotesk-Variable', 'sans-serif'],
        'ClashGrotesk-Extralight': ['ClashGrotesk-Extralight', 'sans-serif'],
        'ClashGrotesk-Light': ['ClashGrotesk-Light', 'sans-serif'],
        'ClashGrotesk-Regular': ['ClashGrotesk-Regular', 'sans-serif'],
        'ClashGrotesk-Medium': ['ClashGrotesk-Medium', 'sans-serif'],
        'ClashGrotesk-Semibold': ['ClashGrotesk-Semibold', 'sans-serif'],
        'ClashGrotesk-Bold': ['ClashGrotesk-Bold', 'sans-serif'],
      },
      colors: {
        live: "#F417C4",
        friend: "#2C1A34", // Define your custom color here
        customPink: "#F417C4",
        customPurple: "#270245",
        purpleProfile : "#15011EB3"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gradientColors: {
        customGradient: "94deg, customPink -8.65%, customPurple 146.68%",
      },
    },
  },
  variants: {},
  plugins: [nextui()],
};

export default config;
