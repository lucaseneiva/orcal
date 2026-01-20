import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

interface DashboardPageHeaderProps {
    title: string
    subtitle?: string
    backHref?: string
    children?: ReactNode
}

export function DashboardPageHeader({
    title,
    subtitle,
    backHref,
    children
}: DashboardPageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
                {backHref && (
                    <Link
                        href={backHref}
                        className="mt-1 p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                        title="Voltar"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                )}

                {/* Títulos */}
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Área de Ação (Botões) */}
            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    )
}