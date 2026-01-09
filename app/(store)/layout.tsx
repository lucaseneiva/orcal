import { getCurrentStore } from '@/lib/utils/get-current-store'
import { StoreNavbar } from '@/components/StoreNavBar'
import { CartProvider } from '@/app/context/cart-context';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const store = await getCurrentStore()

    return (
        
        <CartProvider>
            {store && <StoreNavbar store={store} />}
            {children}
        </CartProvider>

    )
}