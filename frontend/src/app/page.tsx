"use client";
import Image from "next/image";
import { ButtonNav, Hero } from "../../components";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main>
        <Hero />
      </main>
    </NextUIProvider>
  );
}
