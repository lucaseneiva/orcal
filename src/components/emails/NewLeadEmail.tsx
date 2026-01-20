import * as React from 'react';

// 1. Definimos a interface para o item individual do email
interface EmailItem {
  name: string;
  quantity: number | string;
}

interface NewLeadEmailProps {
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  items: EmailItem[];
  tenantName: string;
}

export const NewLeadEmail = ({
  customerName,
  customerEmail,
  customerWhatsapp,
  items,
  tenantName,
}: NewLeadEmailProps) => (
  <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
    <h1 style={{ color: '#000' }}>🔔 Novo Pedido de Orçamento!</h1>
    
    <p>Olá, equipe da <strong>{tenantName}</strong>.</p>
    <p>Você acabou de receber uma nova solicitação através do seu catálogo online.</p>

    <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3 style={{ marginTop: 0 }}>Dados do Cliente</h3>
      <p style={{ margin: '5px 0' }}><strong>Nome:</strong> {customerName}</p>
      <p style={{ margin: '5px 0' }}><strong>Email:</strong> {customerEmail || 'Não informado'}</p>
      <p style={{ margin: '5px 0' }}><strong>WhatsApp:</strong> {customerWhatsapp}</p>
    </div>

    <h3>Itens Solicitados:</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#eee', textAlign: 'left' }}>
          <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Produto</th>
          <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Qtd</th>
        </tr>
      </thead>
      <tbody>
        {/* O TypeScript agora sabe que item possui as propriedades name e quantity */}
        {items.map((item: EmailItem, index: number) => (
          <tr key={index}>
            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.name}</td>
            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eaeaea' }} />
    
    <p style={{ fontSize: '12px', color: '#888' }}>
      Este email foi enviado automaticamente pela plataforma <strong>Orçal SaaS</strong>.
    </p>
  </div>
);