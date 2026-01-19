import Link from 'next/link'

export function ProductEmptyState({ primaryColor }: { primaryColor: string }) {
    return (
        <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            </div>

            <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-500 mb-6">
                Comece adicionando seu primeiro produto.
            </p>

            <Link
                href="/dashboard/products/new"
                className="inline-block text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                style={{ backgroundColor: primaryColor }}
            >
                + Cadastrar Primeiro Produto
            </Link>
        </div>
    )
}