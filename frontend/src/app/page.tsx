"use client";
import Image from "next/image";
import { ButtonNav, Hero } from "../../components";
import { NextUIProvider } from "@nextui-org/react";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main>
        <NavBar boolBut={true} />
        <Hero />
        <Footer />
      </main>
    </NextUIProvider>
  );
}
