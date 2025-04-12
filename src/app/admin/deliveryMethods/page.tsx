"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { Card, CardContent } from "@/app/components/ui/Card";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  deliveryMethodsLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { DeliveryMethod } from "@/app/types/deliveryMethods";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function DeliveryMethodsPage() {
  const token = getAuthToken();
  const [methods, setMethods] = useState<DeliveryMethod[]>([]);
  const [form, setForm] = useState<Omit<DeliveryMethod, "id">>({
    name: "",
    freeShippingOver: 0,
    minCost: 0,
    maxWeight: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMethods = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_url}/api/records/deliveryMethods`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setMethods(res.data.records);
    } catch (err) {
      console.error(sweetAlert.errorInReceiveData, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Swal.fire({
        icon: "error",
        title: sweetAlert.error,
        text: deliveryMethodsLocalization.addNamePlease,
        confirmButtonText: sweetAlert.okay,
      });
      return;
    }
    setIsLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${BASE_url}/api/records/deliveryMethods/${editingId}`,
          form,
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditingId(null);
      } else {
        await axios.post(`${BASE_url}/api/records/deliveryMethods`, form, {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setForm({ name: "", freeShippingOver: 0, minCost: 0, maxWeight: 0 });
      fetchMethods();
      setIsModalOpen(false);

      Swal.fire({
        icon: "success",
        title: editingId
          ? sweetAlert.successfullyEdited
          : sweetAlert.seccessfullyAdded,
        confirmButtonText: sweetAlert.ok,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: sweetAlert.errorInSubmit,
        text: sweetAlert.tryAgain,
        confirmButtonText: sweetAlert.okay,
      });
    } finally {
      setIsLoading(false);
    }
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
    const result = await Swal.fire({
      title: sweetAlert.areYouSure,
      text: sweetAlert.irrevocable,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: sweetAlert.yesDelete,
      cancelButtonText: sweetAlert.cancel,
    });

    if (result.isConfirmed) {
      await axios.delete(`${BASE_url}/api/records/deliveryMethods/${id}`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMethods();
      Swal.fire({
        title: sweetAlert.delete,
        text: sweetAlert.successfullyDeleted,
        icon: "success",
        confirmButtonText: sweetAlert.okay,
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">
          {deliveryMethodsLocalization.deliveryMethodsManagment}
        </h1>
        <Button
          children={deliveryMethodsLocalization.addNewMethod}
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
                  label={deliveryMethodsLocalization.methodName}
                  placeholder={deliveryMethodsLocalization.typeHere}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  type="number"
                  label={deliveryMethodsLocalization.free}
                  placeholder="0"
                  value={form.freeShippingOver}
                  onChange={(e) =>
                    setForm({ ...form, freeShippingOver: +e.target.value })
                  }
                />
                <Input
                  type="number"
                  label={deliveryMethodsLocalization.minCost}
                  placeholder="0"
                  value={form.minCost}
                  onChange={(e) =>
                    setForm({ ...form, minCost: +e.target.value })
                  }
                />
                <Input
                  type="number"
                  label={deliveryMethodsLocalization.maxWeight}
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
                    {isLoading
                      ? editingId
                        ? deliveryMethodsLocalization.editing
                        : deliveryMethodsLocalization.editing
                      : editingId
                      ? deliveryMethodsLocalization.edit
                      : deliveryMethodsLocalization.addNewMethod}
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
              <th className="p-2 border">{deliveryMethodsLocalization.name}</th>
              <th className="p-2 border">
                {" "}
                {deliveryMethodsLocalization.free}{" "}
              </th>
              <th className="p-2 border">
                {" "}
                {deliveryMethodsLocalization.minCost}
              </th>
              <th className="p-2 border">
                {" "}
                {deliveryMethodsLocalization.maxWeight}
              </th>
              <th className="p-2 border">
                {deliveryMethodsLocalization.operation}
              </th>
            </tr>
          </thead>

          <tbody className="text-center">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  {faLocalization.loading}{" "}
                </td>
              </tr>
            ) : (
              methods.map((method) => (
                <tr key={method.id} className="text-sm">
                  <td className="p-2 border">{method.name}</td>
                  <td className="p-2 border">
                    {method.freeShippingOver.toLocaleString()}{" "}
                    {deliveryMethodsLocalization.rial}
                  </td>
                  <td className="p-2 border">
                    {method.minCost.toLocaleString()}{" "}
                    {deliveryMethodsLocalization.rial}
                  </td>
                  <td className="p-2 border">
                    {method.maxWeight} {deliveryMethodsLocalization.kilo}
                  </td>
                  <td className="p-2 border space-x-2">
                    <div className="flex flex-col gap-2 items-center justify-center lg:flex-row ">
                      <Button
                        onClick={() => handleEdit(method)}
                        className="bg-blue-500 hover:bg-blue-700"
                      >
                        {faLocalization.edit}{" "}
                      </Button>
                      <Button
                        onClick={() => handleDelete(method.id)}
                        className="bg-yellow-500 hover:bg-yellow-700"
                      >
                        {faLocalization.delete}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
