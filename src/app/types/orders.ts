export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  discountPercent: number;
  unitPrice: number;
}

export interface OrderDeliveryMethods {
  name: string;
  cost: number;
}
export interface Order {
  id: string;
  customer: string;
  createdAt: string;
  totalPrice: number;
  deliveryStatus: boolean;
  deliveryDate: string | null;
  items: OrderItem[];
  finalAmount: number;
  validDiscount: number;
  discountCode: string;
  finalShippingCost: number;
  deliveryMethods: OrderDeliveryMethods;
  phone: string;
  address: string;
}
