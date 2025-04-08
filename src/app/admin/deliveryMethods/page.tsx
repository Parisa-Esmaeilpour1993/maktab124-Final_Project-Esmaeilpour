"use client";

import { Card, CardContent } from "@/app/components/ui/Card";
import { Base_Url } from "@/app/constants/api/BASE_URL";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import axios from "axios";
import { useEffect, useState } from "react";
import { GridLoader } from "react-spinners";

type DeliveryMethod = {
  id: string;
  name: string;
  freeShippingOver: number;
  minCost: number;
  maxWeight: number;
};

export default function DeliveryMethodsPage() {
  const [methods, setMethods] = useState<DeliveryMethod[]>([]);
  const [form, setForm] = useState<Omit<DeliveryMethod, "id">>({
    name: "",
    freeShippingOver: 0,
    minCost: 0,
    maxWeight: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMethods = async () => {
    const res = await axios.get(`${Base_Url}`);
    setMethods(res.data);
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`${Base_Url}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${Base_Url}`, form);
    }
    setForm({ name: "", freeShippingOver: 0, minCost: 0, maxWeight: 0 });
    fetchMethods();
    setIsModalOpen(false);
  };

  const handleEdit = (method: DeliveryMethod) => {
    setForm({
      name: method.name,
      freeShippingOver: method.freeShippingOver,
      minCost: method.minCost,
      maxWeight: method.maxWeight,
    });
    setEditingId(method.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${Base_Url}/${id}`);
    fetchMethods();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GridLoader
          color="#677284"
          size={24}
          className="absolute top-72 left-2/5 transform -translate-x-1/2"
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت روش‌های ارسال</h1>
        <Button
          children="افزودن روش جدید"
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-700"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <Card className="max-w-xl">
              <CardContent className="space-y-4 p-6">
                <Input
                  label="نام روش ارسالی"
                  placeholder="اینجا بنویسید..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  type="number"
                  label="ارسال رایگان از مبلغ"
                  placeholder="0"
                  value={form.freeShippingOver}
                  onChange={(e) =>
                    setForm({ ...form, freeShippingOver: +e.target.value })
                  }
                />
                <Input
                  type="number"
                  label="حداقل هزینه ارسال"
                  placeholder="0"
                  value={form.minCost}
                  onChange={(e) =>
                    setForm({ ...form, minCost: +e.target.value })
                  }
                />
                <Input
                  type="number"
                  label="حداکثر وزن قابل ارسال (کیلوگرم)"
                  placeholder="0"
                  value={form.maxWeight}
                  onChange={(e) =>
                    setForm({ ...form, maxWeight: +e.target.value })
                  }
                />
                <div className="flex justify-end space-x-4">
                  <Button
                    children="بستن"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 hover:bg-red-700"
                  />
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700"
                  >
                    {editingId ? "ویرایش روش ارسال" : "افزودن روش جدید"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-right">
          <thead className="bg-gray-100 text-sm font-bold">
            <tr className="text-center">
              <th className="p-2 border">نام</th>
              <th className="p-2 border">ارسال رایگان از مبلغ</th>
              <th className="p-2 border">حداقل هزینه</th>
              <th className="p-2 border">حداکثر وزن</th>
              <th className="p-2 border">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {methods.map((method) => (
              <tr key={method.id} className="text-sm">
                <td className="p-2 border">{method.name}</td>
                <td className="p-2 border">
                  {method.freeShippingOver.toLocaleString()} ریال
                </td>
                <td className="p-2 border">
                  {method.minCost.toLocaleString()} ریال
                </td>
                <td className="p-2 border">{method.maxWeight} کیلوگرم</td>
                <td className="p-2 border space-x-2">
                  <Button
                    onClick={() => handleEdit(method)}
                    className="bg-blue-500 hover:bg-blue-700"
                  >
                    ویرایش
                  </Button>
                  <Button
                    onClick={() => handleDelete(method.id)}
                    className="bg-yellow-500 hover:bg-yellow-700"
                  >
                    حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
