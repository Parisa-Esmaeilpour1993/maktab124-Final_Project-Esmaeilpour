export interface FavoriteRecord {
  id: string;
  productId: string;
  createdAt: string;
}

export interface Drug {
  id: string;
  productName: string;
  productPrice: number;
  productExpired: string;
  image: string;
  productQuantity: number;
  discountPercent: number;
}

export interface FavoriteProduct {
  favoriteId: string;
  product: Drug;
  discountPercent: number;
}
