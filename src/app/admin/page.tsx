"use client";

import { Card, CardContent, CardTitle } from "@/app/components/ui/Card";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import useUsersLength from "../components/admin/user/useUsersLength";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { dashboardLocalization } from "../constants/localization/fa/localization";
import { Category } from "../types/category";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ProductsProps } from "../types/products";
import { OrderRecord } from "../types/orders";

type PieChartData = {
  name: string;
  value: number;
};

function generateColor(index: number) {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 80%, 60%)`;
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-light p-2 rounded shadow text-sm text-gray-800">
        <p>{item.value}٪</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white p-2 rounded shadow text-sm text-gray-800">
        <p>({item.value})</p>
      </div>
    );
  }
  return null;
};
export default function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [rotateLabels, setRotateLabels] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersNum, setOrdersNum] = useState<number>(0);

  const usersLength = useUsersLength();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [barData, setBarData] = useState<PieChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(`${BASE_url}/api/records/category`, {
            headers: { api_key: API_KEY },
          }),
          axios.get(`${BASE_url}/api/records/drugs`, {
            headers: { api_key: API_KEY },
          }),
        ]);

        const categoryList = categoriesRes.data.records;
        const productList = productsRes.data.records;

        setCategories(categoryList);
        setProducts(productList);

        const categoryMap: Record<string, string> = {};
        categoryList.forEach((cat: Category) => {
          categoryMap[cat.id] = cat.title;
        });

        const categoryCounts: Record<string, number> = {};
        productList.forEach((product: ProductsProps) => {
          const title =
            categoryMap[product.productCategory] || "دسته‌بندی نامشخص";
          categoryCounts[title] = (categoryCounts[title] || 0) + 1;
        });

        const pieDataFormatted = Object.entries(categoryCounts).map(
          ([name, value]) => ({ name, value })
        );

        setPieData(pieDataFormatted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (products.length === 0 || categories.length === 0) return;
    const fetchOrders = async () => {
      try {
        const res = await axios(`${BASE_url}/api/records/orders`, {
          headers: {
            api_key: API_KEY,
          },
        });
        const orders: OrderRecord[] = res.data.records;
        setOrders(orders);
        const ordersNum = orders.length;
        setOrdersNum(ordersNum);

        const orderedCategoryCounts: Record<string, number> = {};
        let totalOrderedProducts = 0;

        orders.forEach((order) => {
          order.products.forEach(({ category, quantity }) => {
            totalOrderedProducts += quantity;
            const categoryTitle =
              categories.find((c) => c.id === category)?.title ??
              "دسته‌بندی نامشخص";
            orderedCategoryCounts[categoryTitle] =
              (orderedCategoryCounts[categoryTitle] || 0) + quantity;
          });
        });

        const barDataFormatted = Object.entries(orderedCategoryCounts).map(
          ([name, value]) => ({
            name,
            value: Math.round((value / totalOrderedProducts) * 100),
          })
        );

        setBarData(barDataFormatted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [products, categories]);

  const totalIncome = orders.reduce(
    (sum, order) => sum + (order.finalAmount || 0),
    0
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobileSize = width < 768;
      setIsMobile(isMobileSize);

      if (!isMobileSize && barData.length > 3) {
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
            <p className="font-bold text-green-600">{ordersNum}</p>
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
                  <Tooltip content={CustomTooltipPie} />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 md:mt-0 md:w-1/2 space-y-2">
                {pieData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-end gap-2 flex-row-reverse text-right"
                  >
                    <span className="text-gray-700 text-xs">
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
                    angle={rotateLabels ? -20 : 0}
                    textAnchor={rotateLabels ? "middle" : "middle"}
                    tick={{ fontSize: 10, dy: rotateLabels ? 20 : 0 }}
                    height={rotateLabels ? 40 : 30}
                  />
                  <YAxis allowDecimals={false} tickMargin={24} />
                  <Tooltip
                    content={CustomTooltip}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="value" fill="#328e6e" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
