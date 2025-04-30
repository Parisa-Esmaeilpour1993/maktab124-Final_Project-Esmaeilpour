export interface OffTicket {
  id: string;
  name: string;
  discount: number;
  discountMinOrder: number;
}

export interface DiscountCodeProps {
  offTickets: OffTicket[];
  setValidDiscount: (value: number) => void;
  calculateTotalPrice: () => number;
}
