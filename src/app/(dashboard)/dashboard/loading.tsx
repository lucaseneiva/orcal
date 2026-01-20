import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
            <p className="text-sm font-medium animate-pulse">Carregando painel...</p>
        </div>
    )
}