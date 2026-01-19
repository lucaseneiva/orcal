import Link from 'next/link'
import { ProductRaw } from '@/lib/types/types'

interface ProductListProps {
    products: ProductRaw[]
    primaryColor: string
}

export function ProductList({ products, primaryColor }: ProductListProps) {
    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Nome do Produto
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Status
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                        Ações
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y">
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="p-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                        </td>

                        <td className="p-4">
                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${product.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}
                                />
                                {product.status === 'active'
                                    ? 'Ativo'
                                    : product.status === 'draft'
                                        ? 'Rascunho'
                                        : 'Inativo'}
                            </span>
                        </td>

                        <td className="p-4 text-right">
                            <Link
                                href={`/dashboard/products/${product.id}/edit`}
                                className="px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity "
                                style={{ color: primaryColor }}
                            >
                                Editar
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}