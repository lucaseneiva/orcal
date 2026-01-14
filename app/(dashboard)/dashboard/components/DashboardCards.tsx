'use client'

import { toast } from "sonner";

import Link from "next/link";

interface DashboardCardsProps {
  primaryColor: string;
}

export function DashboardCards({ primaryColor }: DashboardCardsProps) {
  return (
    <>
      <button 
        onClick={() => toast.success('Sonner está funcionando!')}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Testar Toast
      </button>

      {/* Card de Produtos */}
      <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
        <h2 className="text-xl font-bold text-gray-900">
          Catálogo de Produtos
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Gerenciar produtos
        </p>
        <Link
          href="/dashboard/products"
          className="mt-6 inline-block text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 hover:shadow-lg active:scale-95 w-fit"
          style={{ backgroundColor: primaryColor }}
        >
          Ver Produtos
        </Link>
      </div>

      {/* Card de Atributos */}
      <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
        <h2 className="text-xl font-bold text-gray-900">
          Atributos Cadastrados
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Gerenciar os atributos para produtos
        </p>
        <Link
          href="/dashboard/attributes"
          className="mt-6 inline-block text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 hover:shadow-lg active:scale-95 w-fit"
          style={{ backgroundColor: primaryColor }}
        >
          Ver Atributos
        </Link>
      </div>

      {/* Card de Pedidos */}
      <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
        <h2 className="text-xl font-bold text-gray-900">
          Pedidos de Orçamento
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Gerenciar os seus pedidos de orçamento
        </p>
        <Link
          href="/dashboard/quote-requests"
          className="mt-6 inline-block text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 hover:shadow-lg active:scale-95 w-fit"
          style={{ backgroundColor: primaryColor }}
        >
          Ver Pedidos
        </Link>
      </div>
    </>
  );
}