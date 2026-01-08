import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Isso desativa a otimização (que causa o erro do IP privado) 
    // apenas quando você está rodando localmente.
    unoptimized: process.env.NODE_ENV === 'development',
    
    remotePatterns: [
      // 1. For Local Development (Supabase CLI)
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      // 2. For Production (Add this now so it works when you deploy)
      {
        protocol: "https",
        // ID URL do seu Supabase
        hostname: process.env.NEXT_STORAGE_SUPABASE_URL! || "",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
