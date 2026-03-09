import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Inflection Labs — Market Access Intelligence",
  description:
    "AI-powered market access intelligence for biotech commercial teams",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-[232px] min-h-screen transition-all duration-200">{children}</main>
      </body>
    </html>
  );
}
