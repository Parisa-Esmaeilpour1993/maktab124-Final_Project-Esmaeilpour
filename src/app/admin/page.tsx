"use client";

import { Card, CardContent, CardTitle } from "@/app/components/ui/Card";
import { orders, products, users, usersOrders } from "@/data";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardLocalization } from "../constants/localization/fa/localization";
import useUsersLength from "../components/admin/user/useUsersLength";

function generateColor(index: number) {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 80%, 60%)`;
}

const totalIncome = orders.reduce((sum, order) => {
  return (
    sum +
    order.products.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      return acc + (product?.price || 0) * item.quantity;
    }, 0)
  );
}, 0);

type CategoryCounts = {
  [category: string]: number;
};

const categoryCounts: CategoryCounts = products.reduce((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  return acc;
}, {} as CategoryCounts);

const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
  name,
  value,
}));

type OrderedCategoryCounts = {
  [category: string]: number;
};

const orderedCategoryCounts: OrderedCategoryCounts = {};
orders.forEach((order) => {
  order.products.forEach(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      orderedCategoryCounts[product.category] =
        (orderedCategoryCounts[product.category] || 0) + quantity;
    }
  });
});

const barData = Object.entries(orderedCategoryCounts).map(([name, value]) => ({
  name,
  value,
}));

export default function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [rotateLabels, setRotateLabels] = useState(false);

  const usersLength = useUsersLength();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobileSize = width < 768;
      setIsMobile(isMobileSize);

      if (!isMobileSize && barData.length > 7) {
        setRotateLabels(true);
      } else if (isMobileSize) {
        setRotateLabels(true);
      } else {
        setRotateLabels(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [barData.length]);

  return (
    <div className="px-6 space-y-2">
      <h1 className="text-[22px] font-semibold mt-2 text-primary">
        {dashboardLocalization.managementDashboard}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center lg:flex-col">
            <CardTitle className="text-gray-700 text-[15px]">
              👤 {dashboardLocalization.users}
            </CardTitle>
            <p className="font-bold text-blue-600">{usersLength}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center lg:flex-col">
            <CardTitle className="text-gray-700 text-[15px]">
              📦 {dashboardLocalization.orders}
            </CardTitle>
            <p className="font-bold text-green-600">{usersOrders.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center lg:flex-col">
            <CardTitle className="text-gray-700 text-[15px]">
              💰 {dashboardLocalization.totalIncome}
            </CardTitle>
            <p className="font-bold text-red-600">
              {totalIncome.toLocaleString()} {dashboardLocalization.rial}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {dashboardLocalization.categoriesNumber}
            </h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="md:w-1/2"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={generateColor(index)} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 md:mt-0 md:w-1/2 md:pr-8 space-y-2">
                {pieData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-end gap-2 text-sm flex-row-reverse text-right"
                  >
                    <span className="text-gray-700">
                      {item.name} ({item.value})
                    </span>
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: generateColor(index) }}
                    ></span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              {dashboardLocalization.categoriesOrder}
            </h2>
            <div className="flex justify-center items-center">
              <ResponsiveContainer width={500} height={300}>
                <BarChart data={barData} className="mr-2">
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={rotateLabels ? -40 : 0}
                    textAnchor={rotateLabels ? "end" : "middle"}
                    tick={{ fontSize: 12, dy: rotateLabels ? 25 : 0 }}
                    height={rotateLabels ? 50 : 30}
                  />
                  <YAxis allowDecimals={false} tickMargin={16} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#328e6e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
