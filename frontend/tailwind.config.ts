import { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./frontend/app/(ClientLogin)/fill/page.tsx",
    "./frontend/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    "./node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js",
    "./node_modules/@nextui-org/theme/dist/components/input.js",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
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
        friend: '#1F2937', // Define your custom color here
        customPink: "#F417C4",
        customPurple: "#270245",
        purpleProfile : "#15011EB3",
        modalBackground: '#001233',
        buttonbg: "#3E0756",
        bghover: "#fefcfc33",
        stats: "#851487",
        silver : "#C0C0C0",
        fontlight: "#F5F5F5",
        Gold : "#FFD700",
        Silver : "#C0C0C0",
        Bronze : "#CD7F32",
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
