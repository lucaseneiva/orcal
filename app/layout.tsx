import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { StoreService } from "@/lib/services/store-service";
import { headers } from 'next/headers'
import { StoreNotFound } from "@/components/StoreNotFound";
import { StoreProvider } from "@/components/providers/StoreProvider";


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
  const headerStack = await headers()
  const host = headerStack.get('host')

  const defaultPrimaryColor = "#000000"; 
  const storeService = new StoreService()
  const data = await storeService.getStoreDataByHost(host)

  if (!data) {
      return <StoreNotFound />
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        
          <Navbar store={data.store} primaryColor={defaultPrimaryColor} />
          
          <StoreProvider store={data.store}>
            {children}
          </StoreProvider>
          
      </body>
    </html>
  );
}