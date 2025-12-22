# 🚀 Documentação do Workflow (Supabase + Next.js)

## 1. Configuração do Ambiente (Docker)
Para o Supabase CLI funcionar, o Docker precisa estar rodando.
- **Problema de RAM:** Se o Docker consumir muita memória, verificar o arquivo `.wslconfig` na pasta de usuário do Windows (`C:\Users\Voce\.wslconfig`).
- **Comando:** `memory=3GB` (limitador de RAM).

## 2. Fluxo de Desenvolvimento (Manual)
Nós usamos um fluxo híbrido. Não rodamos o banco localmente, usamos o projeto `meu-saas-dev` como rascunho.

**Regra de Ouro:**
- **DEV (`meu-saas-dev`):** Pode mexer no Dashboard online (criar tabelas, colunas).
- **PROD (`meu-saas-prod`):** NUNCA mexer na estrutura pelo Dashboard. Apenas dados (INSERT/DELETE) são permitidos.

### Passo a Passo para Nova Feature:
1. Fazer as alterações no Dashboard do projeto **DEV**.
2. No terminal (VS Code), baixar as mudanças para o computador:
   ```bash
   npx supabase link --project-ref ID_DO_PROJETO_DEV
   npx supabase db pull
   ```
   *(Isso atualiza a pasta `supabase/migrations`)*

3. Gerar os tipos do TypeScript (para o Next.js não reclamar):
   ```bash
   npx supabase gen types typescript --project-id "ID_DO_PROJETO_DEV" --schema public > types/supabase.ts
   ```

4. Enviar as mudanças para **PROD**:
   ```bash
   npx supabase link --project-ref ID_DO_PROJETO_PROD
   npx supabase db push
   ```

## 3. Pós-Deploy (O Pulo do Gato)
O comando `db push` leva apenas as **Tabelas**. Ele **NÃO** leva os dados.
- **Se o site crashar (Erro 500):** Verificar se faltam dados essenciais (ex: tabelas `tenants`, `planos`, `configs`).
- **Solução:** Entrar no Dashboard de Produção > Table Editor e inserir os dados iniciais manualmente.

## 4. Cheat Sheet de Comandos
- `npx supabase login` - Autenticar no CLI.
- `npx supabase link --project-ref X` - Conectar no projeto certo.
- `npx supabase db pull` - Baixar estrutura (Do remoto -> Para local).
- `npx supabase db push` - Subir estrutura (Do local -> Para remoto).
- `npx supabase migration repair --status reverted <id>` - Usar caso o histórico de migrations bugue.

---