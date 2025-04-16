export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  createdAt: string;
  totalPrice: number;
  deliveryStatus: boolean;
  deliveryDate: string | null;
  items: OrderItem[];
}
