# 🎯 Orçal SaaS - Motor de Orçamentos White-Label

> **Visão do Produto:** Uma plataforma white-label para que gráficas (e empresas sob demanda) criem catálogos de produtos online e recebam pedidos de orçamento, sem precisar migrar ou refazer seus sites atuais.

## 🚫 O que NÃO somos (O Pivot)
*   **Não somos um Construtor de Sites:** Não concorremos com Wix, Elementor ou WordPress.
*   **Não gerenciamos conteúdo institucional:** "Quem Somos", "Blog" e "Home" ficam no site institucional do cliente.
*   **Não somos um E-commerce tradicional:** Não focamos em pagamento (Stripe/Gateway) no momento, mas na **captura do lead (Orçamento)**.

## ✅ O que SOMOS
*   **Extensão do Site do Cliente:** O cliente cria um subdomínio (ex: `catalogo.grafica.com`) que aponta para nós.
*   **Catálogo de Produtos:** Foco total em exibir produtos, variações, galeria de fotos e especificações técnicas.
*   **Carrinho de Orçamento:** O usuário adiciona itens a uma lista e envia uma solicitação de cotação (Lead).
*   **Painel de Gestão:** Onde o cliente gerencia seus produtos e vê os leads que chegaram.

---

## 🛠 Tech Stack

*   **Framework:** Next.js 14+ (App Router)
*   **Estilização:** Tailwind CSS (Themeable via CSS Variables para cada cliente)
*   **Banco de Dados & Auth:** Supabase (PostgreSQL)
*   **Imagens:** Supabase Storage
*   **Deploy:** Vercel (Suporte a Wildcard Subdomains)

---

## 📂 Estrutura de Pastas (Simplificada)

```text
app/
├── [slug]/                  # (Futuro) Para categorias ou detalhes se necessário
├── admin/                   # Painel do Dono da Gráfica (Protegido)
│   ├── products/            # CRUD de Produtos
│   └── leads/               # Visualização de Orçamentos recebidos
├── login/                   # Autenticação
├── p/                       # Rota de Detalhe do Produto
│   └── [productSlug]/       # ex: /p/cartao-de-visita
├── page.tsx                 # A Vitrine (Grid de Produtos) - Antiga Home
└── layout.tsx               # Header (Logo + Carrinho de Orçamento)
```

---

## 💾 Modelagem de Dados (Core)

### 1. `tenants` (Os Clientes)
Quem paga pelo SaaS.
*   `id`: UUID
*   `name`: "Gráfica Rápida"
*   `domain`: "orcamento.graficarapida.com.br"
*   `colors`: JSON `{ primary: "#FF0000", secondary: "#000000" }`
*   `logo_url`: String

### 2. `products` (O Valor)
O catálogo em si.
*   `id`: UUID
*   `tenant_id`: FK
*   `name`: "Cartão de Visita 300g"
*   `slug`: "cartao-visita-300g"
*   `description`: Text (HTML simples ou Markdown)
*   `images`: Array de Strings (URLs)
*   `is_active`: Boolean
*   `category`: String (ex: "Papelaria")

### 3. `leads` (O Resultado)
Os pedidos de orçamento gerados.
*   `id`: UUID
*   `tenant_id`: FK
*   `customer_name`: "João Silva"
*   `customer_email`: "joao@gmail.com"
*   `customer_whatsapp`: "1199999999"
*   `items`: JSON (Snapshot dos produtos solicitados)
*   `status`: "new" | "contacted" | "closed"

---

## 🚀 Fluxo do Usuário Final

1.  Usuário acessa `produtos.cliente.com`.
2.  Vê a **Vitrine** com a logo e cores da marca.
3.  Clica em um produto -> vai para **Detalhes do Produto** (Fotos, Descrição Técnica).
4.  Clica em **"Adicionar ao Orçamento"**.
5.  Clica no ícone de Cesta -> **"Finalizar Cotação"**.
6.  Preenche Nome/Zap/Email.
7.  **Sucesso:** O Lead é salvo e a Gráfica recebe notificação.

---


