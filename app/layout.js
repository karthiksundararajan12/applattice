import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "AppLattice | AI Automation & Software Solutions",
  description:
    "AppLattice builds AI automation, AI agents, custom software, web applications, mobile apps and business systems for growing companies.",
  keywords: [
    "AI automation",
    "software development",
    "AI agents",
    "WhatsApp automation",
    "CRM",
    "ERP",
    "Bangalore",
    "AppLattice",
  ],
  openGraph: {
    title: "AppLattice | AI Automation & Software Solutions",
    description:
      "AppLattice builds AI automation, AI agents, custom software, web applications, mobile apps and business systems for growing companies.",
    type: "website",
    locale: "en_IN",
    siteName: "AppLattice",
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-text antialiased">
        {children}
      </body>
    </html>
  );
}
