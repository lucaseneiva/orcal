// app/layout.tsx
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { StoreNavbar } from '@/components/StoreNavBar'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const store = await getCurrentStore()

    return (

        <div>
            {store && <StoreNavbar store={store} />}
            {children}
        </div>

    )
}