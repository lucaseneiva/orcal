import './globals.css';
import { headers } from 'next/headers';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/app/context/cart-context";
import { StoreNotFound } from "@/components/StoreNotFound";
import { getCurrentStore } from '@/lib/utils/get-current-store';
import { Footer } from "@/components/Footer";
import { notFound } from 'next/navigation';

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

  // if (!store) {
  //   return (
  //     <html lang="pt-BR">
  //       <body>
  //         <StoreNotFound />
  //       </body>
  //     </html>
  //   );
  // }

  if (!store) {
    const headersList = await headers();
    const host = headersList.get('host');
    const xForwardedHost = headersList.get('x-forwarded-host');
    const dbUrlStatus = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Carregada" : "❌ NÃO ENCONTRADA";
    return <html lang="pt-BR">
      <body>
        <StoreNotFound />
      </body>
    </html>
  }

  // Verificando se a URL do banco existe (não mostre o valor, apenas se existe)
  // Substitua 'DATABASE_URL' pelo nome exato da sua variável de ambiente

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <CartProvider>{<div className="mx-auto bg-gray-50">{children}</div>}</CartProvider>

        <Footer storeName={store.name} />
      </body>
    </html>
  );
}