import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/contexts";

export const metadata: Metadata = {
  title: "Thoughtweaver - AI-Powered Ideation Platform",
  description: "AI-powered ideation and creative thinking through multi-assistant conversations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
