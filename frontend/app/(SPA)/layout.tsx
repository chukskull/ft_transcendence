"use client";
import TopLeftNav from "@/components/global/TopLeftNav";
import "@/styles/globals.scss";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/isauthed`, {
        withCredentials: true,
      })
      .then(() => {})
      .catch(() => {
        router.push("/login");
      });
  }, []);
  return (
    <main className="">
      <TopLeftNav />
      {children}
    </main>
  );
}
