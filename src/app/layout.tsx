"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Inter } from "next/font/google";
import { Provider as JotaiProvider } from "jotai";

const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>Atmos — Weather Dashboard</title>
        <meta name="description" content="A professional weather dashboard with real-time forecasts." />
      </head>
      <body>
        <JotaiProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
