// `app/page.tsx` is the UI for the `/` URL
"use client";
import NavBar from "@/components/main/Navbar/Navbar";
import React from "react";

import Hero from "@/components/main/Hero/Hero";
import Footer from "@/components/main/Footer/Footer";
import About from "@/components/main/About/About";

export default function Page() {
  return (
    <main className="Home">
      <NavBar boolBut={true} />;
      <Hero />
      <About />
      <Footer />
    </main>
  );
}
