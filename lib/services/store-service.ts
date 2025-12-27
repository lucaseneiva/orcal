import { StoreRepository } from '@/lib/repositories/store-repository'
import { ProductRepository } from '@/lib/repositories/product-repository'

export class StoreService {
  constructor(
    private storeRepo = new StoreRepository(),
    private productRepo = new ProductRepository()
  ) {}

  async getStoreDataByHost(host: string | null) {
    const store = await this.storeRepo.findByDomain(host)
    
    if (!store) {
      return null
    }

    const products = await this.productRepo.findByTenantId(store.id)
    return {
      store,
      products,
      primaryColor: store.primary_color as string
    }
  }
}