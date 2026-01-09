interface FooterProps {
  storeName: string;
}

export function Footer({ storeName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    // mt-auto is redundant due to flex-col/flex-grow in layout, 
    // but good to keep as a fallback. 
    <footer className="border-t bg-white mt-auto w-full z-10">
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>
          © {currentYear} <strong>{storeName}</strong> - Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="font-bold text-slate-700">Orçal</span>
        </div>
      </div>
    </footer>
  );
}