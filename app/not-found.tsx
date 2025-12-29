import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Loja não encontrada</h2>
      <p className="text-gray-600 mb-8">
        Não conseguimos localizar a loja ou a página que você está procurando.
      </p>
      
      <Link 
        href="/"
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Voltar para o início
      </Link>
    </div>
  )
}