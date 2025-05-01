export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productExpired: string;
  image: string;
  discountPercent: number;
  productCategory: string;
};

export type CartSummaryProps = {
  items: CartItem[];
};
