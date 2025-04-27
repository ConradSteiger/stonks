import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubLink } from "@/components/github-link";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stonks - Financial Dashboard",
  description: "Track stocks and ETFs with Stonks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="border-b h-16 flex items-center justify-between px-6">
              <div className="flex items-center">
                <MobileSidebar />
                <div className="ml-4 md:ml-0 font-medium">Stonks Dashboard</div>
              </div>
              <div className="flex items-center space-x-2">
                <GitHubLink />
                <ThemeToggle />
              </div>
            </header>

            {/* Main content with sidebar */}
            <div className="flex flex-1 overflow-hidden">
              <div className="hidden md:block w-50 border-r">
                <Sidebar />
              </div>
              <main className="flex-1 overflow-auto p-6">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}