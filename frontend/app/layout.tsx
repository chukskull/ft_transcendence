import { QueryProvider } from "./providers";
import "@/styles/globals.scss";
import { NextProviders } from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PingPong",
  description: "",
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
