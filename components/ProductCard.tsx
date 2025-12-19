export function ProductCard({ name, description, price, imageUrl, color }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900">{name}</h3>
        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-slate-900">{price}</span>
          <button 
            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg text-white"
            style={{ backgroundColor: color }}
          >
            Orçar
          </button>
        </div>
      </div>
    </div>
  )
}