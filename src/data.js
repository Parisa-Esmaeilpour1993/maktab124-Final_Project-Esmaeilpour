// app/(admin)/dashboard/data.js

export const users = [
  { id: 1, name: "علی" },
  { id: 2, name: "زهرا" },
  { id: 3, name: "مریم" },
  // ...
];

export const products = [
  { id: 1, name: "گوشی", category: "دیجیتال", price: 5000000 },
  { id: 2, name: "ماسک", category: "بهداشتی", price: 50000 },
  { id: 3, name: "قرص سرماخوردگی", category: "دارویی", price: 100000 },
  { id: 4, name: "لپ‌تاپ", category: "دیجیتال", price: 15000000 },
  { id: 5, name: "شامپو", category: "بهداشتی", price: 120000 },
  { id: 6, name: "گوشی", category: "یییدیجیتال", price: 5000000 },
  { id: 7, name: "ماسک", category: "نمئبهداشتی", price: 50000 },
  { id: 8, name: "قرص سرماخوردگی", category: "لرادارویی", price: 100000 },
  { id: 9, name: "لپ‌تاپ", category: "دیج", price: 15000000 },
  { id: 10, name: "شامپو", category: "تننبهداشتی", price: 120000 },
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
