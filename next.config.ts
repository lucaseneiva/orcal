import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Substitua 'SUA-ID-DO-PROJETO' pela ID que aparece na URL do seu Supabase
        hostname: 'SUA-ID-DO-PROJETO.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;