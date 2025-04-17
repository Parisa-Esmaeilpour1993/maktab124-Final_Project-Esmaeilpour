"use client";

import EditModal from "@/app/components/admin/pages/EditModal";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  pageLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Textarea } from "@/app/shared/TextArea";
import { ShoppingGuideProps } from "@/app/types/adminGeneralPages";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ShoppingGuide() {
  const [formData, setFormData] = useState<ShoppingGuideProps>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_url}/api/records/shoppingGuide`,
        {
          headers: { api_key: API_KEY },
        }
      );

      const records = response.data.records;
      if (records && records.length > 0) {
        setFormData({
          id: records[0].id,
          title: records[0].title,
          description: records[0].description,
        });
        setIsEditMode(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(sweetAlert.errorInReceiveData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!formData.id;

    try {
      let response;

      if (isEdit) {
        response = await axios.put(
          `${BASE_url}/api/records/shoppingGuide/${formData.id}`,
          {
            title: formData.title,
            description: formData.description,
          },
          {
            headers: {
              api_key: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(sweetAlert.successfullyEdited);
      } else {
        response = await axios.post(
          `${BASE_url}/api/records/shoppingGuide`,
          {
            title: formData.title,
            description: formData.description,
          },
          {
            headers: {
              api_key: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(sweetAlert.seccessfullyAdded);
      }

      if (response.data?.records) {
        setFormData({
          id: response.data.records.id,
          title: response.data.records.title,
          description: response.data.records.description,
        });
        setIsEditMode(true);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(sweetAlert.errorInSendingData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-light rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{pageLocalization.guide}</h2>

      <div className="space-y-4">
        <label className="block mb-1 font-medium">{formData.title}</label>
        <Textarea
          value={formData.description}
          rows={10}
          disabled
          className="bg-white"
        />
        <Button
          children={isEditMode ? faLocalization.edit : faLocalization.add}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <ToastContainer />
    </div>
  );
}
