import TopLeftNav from "@/components/global/TopLeftNav";
import { Metadata } from "next";
import "@/styles/globals.scss";
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
    <main className="p-2">
      <TopLeftNav />
      {children}
    </main>
  );
}
