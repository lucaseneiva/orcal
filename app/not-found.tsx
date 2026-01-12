import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Página não encontrada</h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        O endereço que você tentou acessar não existe dentro desta loja. 
        Verifique a URL ou volte para a vitrine.
      </p>
      
      <Link 
        href="/"
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition shadow-lg"
      >
        Voltar para o início
      </Link>
    </div>
  )
}