// `app/page.tsx` is the UI for the `/` URL
"use client";
import NavBar from "@/components/main/Navbar/Navbar";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import "@/styles/globals.css";
import Hero from "@/components/main/Hero/Hero";
import Footer from "@/components/main/Footer/Footer";
import RootLayout from "../layout";

export default function Page() {
  return (
    <main>
      <NextUIProvider>
        <NavBar boolBut={true} />;
        <Hero />
        <Footer />
      </NextUIProvider>
    </main>
  );
}
