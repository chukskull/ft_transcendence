"use client";

import Back from "@/components/Login/organics/Back";
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section>
        <Back />
        {children}
      </section>
    </main>
  );
}
