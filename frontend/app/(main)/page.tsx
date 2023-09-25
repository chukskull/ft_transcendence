// `app/page.tsx` is the UI for the `/` URL
"use client";
import NavBar from "@/components/main/Navbar/Navbar";
import React from "react";
import "@/styles/globals.scss";
import Hero from "@/components/main/Hero/Hero";
import Footer from "@/components/main/Footer/Footer";

export default function Page() {
  return (
    <section>
      <NavBar boolBut={true} />;
      <Hero />
      <Footer />
    </section>
  );
}
