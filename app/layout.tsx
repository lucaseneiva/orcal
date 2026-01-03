import './globals.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/app/context/cart-context";
import { StoreNotFound } from "@/components/StoreNotFound";
import { getCurrentStore } from '@/lib/utils/get-current-store';
import { Footer } from "@/components/Footer";

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

  const store = await getCurrentStore();

  if (!store) {
    return (
      <html lang="pt-BR">
        <body>
          <StoreNotFound />
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <CartProvider>{<div className="mx-auto bg-gray-50">{children}</div>}</CartProvider>
        
        <Footer storeName={store.name} />
      </body>
    </html>
  );
}