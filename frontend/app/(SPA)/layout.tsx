import TopLeftNav from "@/components/global/TopLeftNav";
import { Metadata } from "next";

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
    <main>
      <section className="h-screen w-screen">
        <TopLeftNav />
        {children}
      </section>
    </main>
  );
}
