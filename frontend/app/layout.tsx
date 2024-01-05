import { Metadata } from "next";
import { QueryProvider } from "./providers";
import "@/styles/globals.scss";
import { NextProviders } from "./providers";

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
      <body>
        <NextProviders>
          <QueryProvider>{children}</QueryProvider>
        </NextProviders>
      </body>
    </html>
  );
}
