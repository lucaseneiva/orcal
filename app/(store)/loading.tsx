import { ImageIcon } from "lucide-react";

export default function StoreLoading() {
    return (
        <div className="p-0">
            {/* Header Skeleton */}
            <div className="py-12 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="h-10 w-3/4 bg-gray-200 rounded-lg mx-auto animate-pulse" />
                    <div className="h-6 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse" />

                    <div className="relative shadow-lg rounded-2xl overflow-hidden bg-white border border-gray-100 h-16 w-full animate-pulse" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <section className="max-w-6xl mx-auto py-12 px-6">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-1 w-12 bg-gray-300 rounded-full animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
                            {/* Image Placeholder */}
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center animate-pulse">
                                <ImageIcon className="text-gray-200 w-10 h-10" />
                            </div>

                            <div className="p-5 flex flex-col flex-1 space-y-3">
                                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}