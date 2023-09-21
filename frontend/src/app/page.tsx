"use client";
import Image from "next/image";
import { ButtonNav, Hero } from "../../components";
import { NextUIProvider } from "@nextui-org/react";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <NextUIProvider>
      <main>
        <NavBar />
        <Hero />
        <Footer />
      </main>
    </NextUIProvider>
  );
}
