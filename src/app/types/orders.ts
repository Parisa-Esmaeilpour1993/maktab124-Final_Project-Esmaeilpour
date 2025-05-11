export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  price: number;
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
  deliveryMethod: {
    name: string;
    cost: number;
  };
  items: OrderProduct[];
  totalPrice: number;
  finalShippingCost: number;
  finalAmount: number;
  createdAt: string;
  isDelivered: boolean;
}
