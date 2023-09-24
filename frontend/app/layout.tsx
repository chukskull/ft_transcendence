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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
