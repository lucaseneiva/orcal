import { notFound } from 'next/navigation'
import { login } from '../../actions/auth.actions'
import { getCurrentStore } from '@/lib/utils/get-current-store'

type LoginPageProps = {
    searchParams: Promise<{ message?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams
    const store = await getCurrentStore()

    if(!store) return notFound()
        
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
                    Acesso ao Sistema
                </h1>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded border-gray-300 border p-2 text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded border-gray-300 border p-2 text-gray-700"
                        />
                    </div>

                    <button
                        formAction={login}
                        style={{ backgroundColor: store.primary_color}}
                        className=" text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>

                    {params.message && (
                        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {params.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
