import React from 'react';

interface Props {
  debugData?: {
    host: string | null;
    xForwardedHost: string | null;
  };
}

export function StoreNotFound({ debugData }: Props) {

  const showDebug = process.env.NODE_ENV === 'development'; 
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* User Friendly Message */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Loja não encontrada</h1>
        <p className="text-gray-600 mt-2">
            O endereço que você acessou não está vinculado a uma loja ativa.
        </p>
      </div>

      {/* Developer Debug Info - Only renders if enabled */}
      {showDebug && debugData && (
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-xl border-l-4 border-red-500">
           <h2 className="text-xl font-bold text-red-600 mb-4">🔧 Debug Mode</h2>
           
           <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border">
                <p className="font-bold text-gray-700 uppercase text-xs mb-1">Host Recebido:</p>
                <code className="bg-black text-green-400 p-2 rounded block text-sm">
                  {debugData.host}
                </code>
              </div>
              
              <div className="p-4 bg-gray-50 rounded border">
                <p className="font-bold text-gray-700 uppercase text-xs mb-1">X-Forwarded-Host:</p>
                <code className="bg-black text-yellow-400 p-2 rounded block text-sm">
                  {debugData.xForwardedHost || "Nenhum"}
                </code>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Adicione o <strong>Host Recebido</strong> na coluna <code>domain</code> do banco de dados.
              </p>
           </div>
        </div>
      )}
    </div>
  );
}