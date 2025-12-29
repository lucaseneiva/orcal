import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { StoreService } from "@/lib/services/store-service";
import { headers } from 'next/headers'
import { StoreNotFound } from "@/components/StoreNotFound";
  import { getCurrentStore } from '@/lib/utils/get-current-store';
import { get } from "http";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plataforma de Orçamentos",
  description: "SaaS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultPrimaryColor = "#000000"; 


  const store = await getCurrentStore();

  if (!store) {
      return <StoreNotFound />
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>


          <Navbar store={store} />
            {children}
          
          
      </body>
    </html>
  );
}