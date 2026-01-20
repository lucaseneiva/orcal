import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import CheckoutPage from './checkout-page'

export default async function Page() {
  const store = await getCurrentStore()

  return (
    <CheckoutPage
      primaryColor={store?.primary_color}
    />
  )
}
