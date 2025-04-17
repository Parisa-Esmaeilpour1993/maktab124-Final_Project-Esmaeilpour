export const users = [
  { id: 1, name: "user1" },
  { id: 2, name: "user2" },
  { id: 3, name: "user3" },
  { id: 4, name: "user4" },
];

export const products = [
  { id: 1, name: "گوشی", category: "دیجیتال", price: 5000000 },
  { id: 2, name: "ماسک", category: "بهداشتی", price: 50000 },
  { id: 3, name: "قرص سرماخوردگی", category: "دارویی", price: 100000 },
  { id: 4, name: "لپ‌تاپ", category: "دیجیتال", price: 15000000 },
  { id: 5, name: "شامپو", category: "بهداشتی", price: 120000 },
  { id: 6, name: "گوشی", category: "دیجیتال", price: 5000000 },
  { id: 7, name: "ماسک", category: "بهداشتی", price: 50000 },
  { id: 8, name: "قرص سرماخوردگی", category: "دارویی", price: 100000 },
  { id: 9, name: "لپ‌تاپ", category: "نجهیزات پزشکی", price: 15000000 },
  { id: 10, name: "شامپو", category: "بهداشتی", price: 120000 },
  // ...
];

export const orders = [
  {
    id: 1,
    products: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 5 },
    ],
  },
  {
    id: 2,
    products: [
      { productId: 3, quantity: 1 },
      { productId: 1, quantity: 1 },
    ],
  },
  {
    id: 3,
    products: [
      { productId: 5, quantity: 3 },
      { productId: 4, quantity: 1 },
    ],
  },
  {
    id: 4,
    products: [
      { productId: 4, quantity: 2 },
      { productId: 10, quantity: 5 },
    ],
  },
  {
    id: 5,
    products: [
      { productId: 4, quantity: 2 },
      { productId: 6, quantity: 5 },
    ],
  },
  {
    id: 5,
    products: [
      { productId: 8, quantity: 2 },
      { productId: 7, quantity: 5 },
    ],
  },
  // ...
];

export const usersOrders = [
  {
    id: "123456789",
    customer: "کاربر1",
    createdAt: "2025-04-15T08:20",
    totalPrice: 540000,
    deliveryStatus: false,
    deliveryDate: null,
    items: [
      { id: 1, name: "کرم مرطوب‌کننده", quantity: 2, price: 120000 },
      { id: 2, name: "مولتی‌ویتامین", quantity: 1, price: 80000 },
      { id: 3, name: "ضدآفتاب", quantity: 3, price: 300000 },
    ],
  },
  {
    id: "101112131",
    customer: "کاربر2",
    createdAt: "2025-04-14T14:00",
    totalPrice: 580000,
    deliveryStatus: true,
    deliveryDate: "2025-04-15T10:30",
    items: [
      { id: 4, name: "شامپو تقویت‌کننده", quantity: 1, price: 180000 },
      { id: 5, name: "زینک پلاس", quantity: 2, price: 200000 },
    ],
  },
  {
    id: "141516171",
    customer: "کاربر3",
    createdAt: "2025-04-20T16:00",
    totalPrice: 1180000,
    deliveryStatus: true,
    deliveryDate: "2025-04-26T10:30",
    items: [
      { id: 4, name: "شامپو تقویت‌کننده", quantity: 1, price: 180000 },
      { id: 5, name: "زینک پلاس", quantity: 2, price: 200000 },
      { id: 2, name: "مولتی‌ویتامین", quantity: 2, price: 80000 },
      { id: 6, name: "رویال ژلی", quantity: 3, price: 600000 },
    ],
  },
  {
    id: "181920212",
    customer: "کاربر4",
    createdAt: "2025-04-20T16:00",
    totalPrice: 1180000,
    deliveryStatus: true,
    deliveryDate: "2025-04-26T10:30",
    items: [
      { id: 4, name: "شامپو تقویت‌کننده", quantity: 5, price: 180000 },
      { id: 5, name: "زینک پلاس", quantity: 2, price: 200000 },
      { id: 6, name: "رویال ژلی", quantity: 2, price: 600000 },
    ],
  },
];
