import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "EarnHub - Task Karo, Reward Kamao",
  description: "Professional earning platform - Complete tasks and earn rewards",
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3B82F6"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
      </head>
      <body className={`${inter.className} ${poppins.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {/* Background Decorative Blobs */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--glow-color)] blur-[100px] pointer-events-none -z-10 transition-colors duration-500" />
          <div className="fixed bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[var(--glow-color)] blur-[120px] pointer-events-none -z-10 transition-colors duration-500 opacity-70" />
          
          {children}
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
