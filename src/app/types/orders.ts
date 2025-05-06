export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  finalPrice: number;
  total: number;
  category: string;
}
export interface OrderRecord {
  id: string;
  customer: string;
  userIdi: number | string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  deliveryStatus: boolean;
  deliveryTime: string;
  deliveryDate: string;
  discountCode: string;
  validDiscount: number;
  deliveryMethods: {
    name: string;
    cost: number;
  };
  products: OrderProduct[];
  totalPrice: number;
  finalShippingCost: number;
  finalAmount: number;
  createdAt: string;
  isDelivered: boolean;
}
