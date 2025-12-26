import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. IMPORTAR O PROVIDER (O CÉREBRO)
import { CartProvider } from "@/components/providers/CartProvider";
// 2. IMPORTAR O DRAWER (O VISUAL)
import { CartDrawer } from "@/components/CartDrawer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Vamos definir uma cor padrão pro carrinho por enquanto
  const defaultPrimaryColor = "#000000"; 

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* AQUI É O "WRAPPER" */}
        {/* Tudo o que está dentro de CartProvider tem acesso ao carrinho */}
        <CartProvider>
          
          {/* O componente visual do carrinho fica aqui, disponível em todas as páginas */}
          <CartDrawer primaryColor={defaultPrimaryColor} />
          
          {/* As páginas do seu site (Home, Login, Admin) são renderizadas aqui */}
          {children}

        </CartProvider>

      </body>
    </html>
  );
}