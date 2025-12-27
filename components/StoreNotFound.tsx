export function StoreNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center p-10 bg-white rounded-xl shadow-sm border max-w-md">
        <div className="text-6xl mb-4 p-20">🔍</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Ops! Página não encontrada
        </h1>
        <p className="text-slate-600 leading-relaxed">
          Não conseguimos encontrar o que você está procurando.
          Verifique se o endereço está correto ou entre em contato com o suporte.
        </p>
      </div>
    </div>
  )
}