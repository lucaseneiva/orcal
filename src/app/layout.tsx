import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/src/components/providers/cart-provider";
import { StoreNotFound } from "@/src/components/StoreNotFound";
import { getCurrentStore } from "@/src/lib/utils/get-current-store";
import { headers } from "next/headers";
import { ToasterProvider } from "@/src/components/providers/toaster-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Plataforma de Orçamentos",
  description: "SaaS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await getCurrentStore();

  {/* Errors & Fallbacks */}
  if (!store) {
    const headersList = await headers();
    const debugData = {
      host: headersList.get("host"),
      xForwardedHost: headersList.get("x-forwarded-host"),
    };

    return (
      <html lang="pt-BR">
        <body className="bg-gray-100 min-h-screen flex items-center justify-center">
          <StoreNotFound debugData={debugData} />
        </body>
      </html>
    );
  }

  {/* App render */}
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <div className="mx-auto bg-gray-100 w-full flex-1">{children}</div>
          <ToasterProvider />
        </CartProvider>
      </body>
    </html>
  );
}
