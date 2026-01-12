import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/app/context/cart-context";
import { StoreNotFound } from "@/components/StoreNotFound";
import { getCurrentStore } from "@/lib/utils/get-current-store";
import { headers } from "next/headers";

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

  // SEPARATION OF CONCERNS:
  // The layout detects the error, but delegates the UI to a specific component.
  if (!store) {
    // We pass the debug data as props so the component can decide to show it or not
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

  // HAPPY PATH: Render the actual app
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <div className="mx-auto bg-gray-100 w-full flex-1">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
