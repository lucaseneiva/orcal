export function Hero({ name, primaryColor }: { name: string, primaryColor: string }) {
  return (
    <section 
      className="py-20 px-6 text-center transition-all"
      style={{ backgroundColor: primaryColor + '10' }} // Cor do banco com 10% de opacidade
    >
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
        Bem-vindo à <span style={{ color: primaryColor }}>{name}</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Soluções gráficas de alta qualidade com a agilidade que você precisa.
      </p>
      <button 
        className="mt-8 px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105"
        style={{ backgroundColor: primaryColor }}
      >
        Ver Catálogo
      </button>
    </section>
  )
}

