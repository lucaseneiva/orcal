'use client'

import { useState } from 'react'

const MOCK_OPTIONS = {
  materiais: ['Papel Couché 300g', 'Papel Reciclato', 'Supremo 300g'],
  acabamentos: ['Sem Verniz', 'Verniz Total Frente', 'Laminação Fosca'],
  cores: ['4x0 (Frente Colorida)', '4x1', '4x4'],
  tamanhos: ['9x5 cm', '8.5x5.5 cm', '9x9 cm'],
  quantidades: [100, 250, 500, 1000, 2500, 5000]
}

export default function ProductForm({ product, store }: { product: any, store: any }) {
  const [qtd, setQtd] = useState(MOCK_OPTIONS.quantidades[1])
  
  // Tenta pegar a cor da loja, se não tiver, usa preto como fallback
  const brandColor = store.primary_color || store.color || '#000000';

  return (
    <div className="mt-8 space-y-6">
      
      {/* Grid de Opções - Com bordas mais visíveis e texto escuro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Material</label>
          <select className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none">
            {MOCK_OPTIONS.materiais.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Acabamento</label>
          <select className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none">
            {MOCK_OPTIONS.acabamentos.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Cores</label>
          <select className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none">
            {MOCK_OPTIONS.cores.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Tamanho</label>
          <select className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none">
            {MOCK_OPTIONS.tamanhos.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Seleção de Quantidade */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Quantidade</label>
        <div className="flex flex-wrap gap-2">
          {MOCK_OPTIONS.quantidades.map((q) => {
            const isSelected = qtd === q;
            return (
              <button
                key={q}
                onClick={() => setQtd(q)}
                // AQUI A MÁGICA: Se selecionado, usa a cor da loja no fundo e borda
                style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor, color: '#FFF' } : {}}
                className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors ${
                  isSelected 
                  ? '' // O style acima cuida da cor ativa
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                {q} un
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <button 
          // Botão Principal com a cor da marca
          style={{ backgroundColor: brandColor }}
          className="w-full text-white py-3.5 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-sm"
          onClick={() => alert(`Adicionado ao carrinho (Cor da loja: ${brandColor})`)}
        >
          Adicionar ao Carrinho
        </button>
        
        <button 
          className="w-full bg-white text-gray-800 border-2 border-gray-300 py-3.5 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-400 transition"
          onClick={() => alert('Abrir modal de orçamento...')}
        >
          Pedir Orçamento
        </button>
      </div>
    </div>
  )
}