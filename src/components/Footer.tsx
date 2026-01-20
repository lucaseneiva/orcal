interface FooterProps {
  storeName: string;
  primaryColor?: string;
}

export function Footer({ storeName, primaryColor = '#6366f1' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="mt-auto w-full z-10 transition-all duration-300"
      style={{ 
        backgroundColor: primaryColor,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="max-w-6xl mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-white/90 font-medium">
          © {currentYear} <strong className="font-bold">{storeName}</strong> - Todos os direitos reservados.
        </p>
        
        <div className="flex items-center gap-2 text-white/80">
          <span>Powered by</span>
          <span className="font-bold text-white">Orçal</span>
        </div>
      </div>
      
      {/* Linha preta fina no topo */}
      <div className="h-p w-full bg-black/20 absolute top-0" />
    </footer>
  );
}