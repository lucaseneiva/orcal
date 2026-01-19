import Link from 'next/link'

export function ProductHeader({ primaryColor }: { primaryColor: string }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Seus Produtos</h1>
            </div>

            <Link
                href="/dashboard/products/new"
                className="text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                style={{ backgroundColor: primaryColor }}
            >
                + Novo Produto
            </Link>
        </div>
    )
}