import { createClient } from "@/lib/utils/supabase/server";
import { getCurrentStore } from "@/lib/utils/get-current-store";
import { redirect } from "next/navigation";
import { QuoteRequestCard } from "./components/QuoteRequestCard";
import { QuoteRequestRepo } from "@/lib/data/quote-requests";
// Import the interface to ensure we are aligning correctly
import type { QuoteRequest } from "./components/QuoteRequestCard";

export default async function quoteRequestsPage() {
  const store = await getCurrentStore();

  if (!store) redirect("/");

  const supabase = await createClient();
  const quoteRequestRepo = new QuoteRequestRepo(supabase);
  const rawQuoteRequests = await quoteRequestRepo.getFromStore(store.id);

  if (!rawQuoteRequests || rawQuoteRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Pedidos de Orçamento</h1>
        <div className="p-12 border-2 border-dashed rounded-xl bg-gray-50 mt-6">
          <p className="text-gray-500">Nenhum pedido recebido ainda.</p>
        </div>
      </div>
    );
  }

  const quoteRequests: QuoteRequest[] = rawQuoteRequests.map((order) => ({
    ...order,
    // Fix boolean: null/undefined becomes false
    viewed: !!order.viewed,

    // Fix string: fallback to empty string or ISO date if null
    created_at: order.created_at || new Date().toISOString(),

    // FIX "Unexpected any": Cast through unknown instead of any
    items: order.items as unknown as QuoteRequest["items"],

    // Fix numbers: fallback to 0 if null
    total_items: order.total_items ?? 0,
  }));

  const newquoteRequestsCount = quoteRequests.filter((o) => !o.viewed).length;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos de Orçamento</h1>
          <p className="text-sm text-gray-500 mt-1">
            {newquoteRequestsCount > 0 ? (
              <span className="text-blue-600 font-semibold">
                {newquoteRequestsCount} novo
                {newquoteRequestsCount > 1 ? "s" : ""} pedido
                {newquoteRequestsCount > 1 ? "s" : ""}
              </span>
            ) : (
              "Todos os pedidos visualizados"
            )}
          </p>
        </div>

        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          Total: {quoteRequests.length}
        </span>
      </div>

      <div className="grid gap-4">
        {quoteRequests.map((order) => (
          <QuoteRequestCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
