import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider, ThemeProvider } from "./providers";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Computer Science Attendance",
  description:
    "A platform to take attendance records of computer science students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider>
            <main className="flex min-h-screen bg-background">{children}</main>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
