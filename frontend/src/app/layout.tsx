import "./globals.css";
import type { Metadata } from "next";
import NavBar from "../../components/Navbar";

export const metadata: Metadata = {
  title: "PingPongWebsite",
  description: "42 project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
