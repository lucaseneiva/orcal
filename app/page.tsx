import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Vertexgraf SaaS MVP 🚀
        </h1>
        <p className="text-slate-600 mb-6">
          A estrutura Next.js + Tailwind + Vercel está operante.
        </p>
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-blue-700 font-medium">
            Próximo passo: Conectar o Supabase e listar os produtos do catálogo.
          </p>
        </div>
      </div>
    </main>
  )
}