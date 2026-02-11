# 🖨️ Orçal SaaS - Plataforma Multi-tenant de Orçamentos

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Deploy](https://img.shields.io/badge/deploy-Vercel-black.svg)

<!-- Tech Stack Badges -->
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

[Ver Demo Online](https://seusite.vercel.app) · [Reportar Bug](https://github.com/seusite/issues)

</div>

---

## 📖 Sobre o Projeto

**Orçal** é uma plataforma SaaS (Software as a Service) Multi-tenant projetada para gráficas, empresas de brindes e negócios que operam sob modelo de orçamento e não venda direta.

Diferente de um e-commerce tradicional, o Orçal foca na **configuração complexa de produtos** (ex: Tipo de Papel, Gramatura, Acabamento) e gera leads qualificados através de pedidos de orçamento que chegam via E-mail e WhatsApp.

### ✨ Diferenciais Técnicos
- **Arquitetura Multi-tenant:** Uma única base de código serve múltiplas lojas. A loja é resolvida dinamicamente baseada no domínio/subdomínio acessado (`get-current-store.ts`).
- **Performance:** Utilização de **Server Components** do Next.js 15 para renderização rápida e SEO otimizado.
- **Otimização de Imagens:** Upload com conversão automática para **AVIF** no client-side antes do envio para o Supabase Storage, reduzindo custos de banda e armazenamento.
- **Sistema de Atributos Dinâmicos:** Estrutura de banco de dados flexível que permite criar variações infinitas de produtos (ex: Cor, Tamanho, Material) sem alterar o schema.

---

## 🏗️ Arquitetura e Fluxo de Dados

O sistema utiliza a detecção de host nos headers da requisição para identificar qual loja carregar. Isso garante isolamento de dados entre os clientes do SaaS.

### Diagrama C4 - Contexto do Sistema

![C4 Diagram](https://github.com/lucaseneiva/orcal/blob/main/docs/c4.png)

### Diagrama de Casos de Uso

![Use Case Diagram](https://github.com/lucaseneiva/orcal/blob/main/docs/usecase.png)

---

## 🛠️ Tecnologias Utilizadas

### Core
*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **Ícones:** [Lucide React](https://lucide.dev/)

### Backend & Dados
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS)
*   **Armazenamento:** Supabase Storage (Buckets para imagens)
*   **Validação:** [Zod](https://zod.dev/) (Schema validation para Server Actions)
*   **E-mail Service:** [Brevo](https://www.brevo.com/) (antigo Sendinblue)

### UX/UI Features
*   **Toasts:** [Sonner](https://sonner.emilkowal.ski/)
*   **Gerenciamento de Estado:** React Context API (Carrinho) + URL State
*   **Fontes:** Geist Sans & Mono

---

## 📸 Screenshots

| Vitrine da Loja | Configurador de Produto |
|:---:|:---:|
| ![Vitrine](https://github.com/lucaseneiva/orcal/blob/main/public/screens/Screenshot%20from%202026-02-11%2008-03-01.png) | ![Produto](https://github.com/lucaseneiva/orcal/blob/main/public/screens/Screenshot%20from%202026-02-11%2008-03-11.png) |

| Dashboard Admin | Lista de Pedidos |
|:---:|:---:|
| ![Dashboard](https://github.com/lucaseneiva/orcal/blob/main/public/screens/Screenshot%20from%202026-02-11%2008-04-01.png) | ![Pedidos](https://github.com/lucaseneiva/orcal/blob/main/public/screens/Screenshot%20from%202026-02-11%2008-04-13.png) |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
*   Node.js 18+
*   Conta no Supabase
*   Conta no Brevo (para e-mails)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/orcal-saas.git
   cd orcal-saas
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env.local` na raiz e preencha:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_anon
   BREVO_API_KEY=sua_api_key_brevo
   ```

4. **Configuração do Banco de Dados (Supabase)**
   Execute as queries SQL (disponíveis em `/sql` ou via migration) para criar as tabelas: `stores`, `products`, `attributes`, `options`, `products_options`, `quote_requests`.

5. **Execute o projeto**
   ```bash
   npm run dev
   ```
   
   > **Nota:** Para testar o multi-tenant localmente, você precisará configurar hosts no seu arquivo `hosts` do sistema (ex: `127.0.0.1 loja-teste.local`) ou inserir manualmente a loja no banco com o domínio `localhost:3000`.

---

## 🗃️ Estrutura do Banco de Dados

O projeto utiliza um modelo relacional robusto para suportar a flexibilidade dos produtos:

### Diagrama Entidade-Relacionamento (DER)

![DER Diagram](https://github.com/lucaseneiva/orcal/blob/main/docs/der.png)

### Descrição das Tabelas

*   **stores:** Tabela principal. Define o tenant (domínio, cores, logo).
*   **attributes:** Definições genéricas (ex: "Tamanho", "Papel"). Vinculado à `store`.
*   **options:** Os valores dos atributos (ex: "A4", "Couché 300g").
*   **products:** O item base.
*   **products_options:** Tabela pivô (Many-to-Many) que define quais opções estão disponíveis para um produto específico.
*   **quote_requests:** Armazena os pedidos, o JSON do carrinho e o status.

---

## 🛡️ Segurança

*   **Row Level Security (RLS):** Todas as queries ao banco de dados passam por políticas de segurança do Supabase. Um usuário autenticado só pode ver/editar dados da loja à qual seu `profile` está vinculado.
*   **Server Actions:** Mutações de dados ocorrem estritamente no servidor, prevenindo injeção de dados maliciosos.
*   **Zod Parsing:** Todos os inputs de formulários são validados com Zod antes de processamento.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um Pull Request.

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---
