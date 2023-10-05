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
    <main
      style={{
        paddingTop: "60px",
        paddingLeft: "60px",
        background: "none",
      }}
    >
      <TopLeftNav />
      {children}
    </main>
  );
}
