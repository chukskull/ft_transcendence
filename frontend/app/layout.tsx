import { Metadata } from "next";
import { Providers, QueryProvider } from "./providers";
import "@/styles/globals.scss";
import { Query } from "react-query";

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
        <QueryProvider>
          <Providers>{children}</Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
