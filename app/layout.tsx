import './globals.css';
import { headers } from 'next/headers';
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
    const headerStack = await headers();
    const host = headerStack.get('host');
    const xForwardedHost = headerStack.get('x-forwarded-host');
    const dbUrlStatus = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Carregada" : "❌ NÃO ENCONTRADA";

    return (
      <html lang="pt-BR">
        <body className="bg-gray-100 p-10 font-sans min-h-screen">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-xl border-l-4 border-red-500">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Debug - Store Not Found</h1>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border">
                <p className="font-bold text-gray-700 uppercase text-xs mb-1">Host Recebido (Next.js):</p>
                <code className="bg-black text-green-400 p-2 rounded block text-sm break-all">
                  {host}
                </code>
              </div>

              <div className="p-4 bg-gray-50 rounded border">
                <p className="font-bold text-gray-700 uppercase text-xs mb-1">X-Forwarded-Host (Proxy):</p>
                <code className="bg-black text-yellow-400 p-2 rounded block text-sm break-all">
                  {xForwardedHost || "Nenhum"}
                </code>
              </div>

              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <p className="font-bold text-blue-800 uppercase text-xs mb-1">Status da Variável de Banco:</p>
                <p className="font-mono text-lg">{dbUrlStatus}</p>
              </div>

              <div className="mt-6 pt-4 border-t">
                 <p className="text-sm text-gray-600">
                   <strong>Ação:</strong> Copie EXATAMENTE o valor do campo <u>Host Recebido</u> e coloque na coluna <code>domain</code> do seu banco de dados.
                 </p>
              </div>
            </div>
          </div>
          <div className="opacity-50 mt-10 pointer-events-none">
             <StoreNotFound />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <CartProvider>
          {}
          <div className="mx-auto bg-gray-100 w-full flex-1">
            {children}
          </div>
        </CartProvider>

        <Footer storeName={store.name} />
      </body>
    </html>
  );
}