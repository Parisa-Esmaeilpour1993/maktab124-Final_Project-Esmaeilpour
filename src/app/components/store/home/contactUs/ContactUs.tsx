"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_url, API_KEY } from "@/app/constants/api/BASE_URL";
import { getAuthToken } from "@/app/base/getAuthToken";
import {
  adminLocalization,
  faLocalization,
  pageLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { ContactUsData } from "@/app/types/adminGeneralPages";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";
import Button from "@/app/shared/Button";
import { toast } from "react-toastify";

function ContactUs() {
  const [contactUs, setContactUs] = useState<ContactUsData>();
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const phoneRegex = /^09\d{9}$/;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_url}/api/records/contactUs`, {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.records && res.data.records.length > 0) {
          setContactUs(res.data.records[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { fullName, phone } = formData;

    if (!fullName || !phone) {
      return toast.warning(pageLocalization.required);
    }

    if (!phoneRegex.test(phone)) {
      return toast.error(pageLocalization.phoneRegex);
    }

    try {
      const res = await axios.post(
        `${BASE_url}/api/records/connections`,
        formData,
        {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success(pageLocalization.successfullMessage);
        setFormData({ fullName: "", phone: "", email: "", message: "" });
      }
    } catch (err) {
      toast.error(sweetAlert.error);
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">{faLocalization.loading}</div>;

  return (
    <div className="p-6 border-t-2 border-secondary mx-4">
      <h1 className="text-center text-2xl font-extrabold mb-6">
        {pageLocalization.contactUs}
      </h1>
      {contactUs ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-light shadow-inner p-8 rounded-md">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{pageLocalization.address}:</p>
              <p>{contactUs.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{pageLocalization.email}:</p>
              <p>{contactUs.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{pageLocalization.phone}:</p>
              <p>{contactUs.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{pageLocalization.resumeEmail}:</p>
              <p>{contactUs.resumeEmail}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {pageLocalization.managerConnection}:
              </p>
              <p>{contactUs.managerEmail}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <p className="text-[14px]">{pageLocalization.description}</p>
            <div className="flex flex-col gap-4">
              <Input
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder={adminLocalization.fullName}
                className="text-[14px] md:text-[16px]"
              />
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={adminLocalization.phone}
                className="text-[14px] md:text-[16px]"
              />
              <Input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={
                  adminLocalization.address + " " + adminLocalization.email
                }
                className="text-[14px] md:text-[16px]"
              />
            </div>
          </div>
          <div className="w-full lg:self-end">
            <Textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={pageLocalization.textarea}
              className="text-[14px] md:text-[16px]"
              rows={6}
            />
            <Button
              children={pageLocalization.send}
              onClick={handleSubmit}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <p>{faLocalization.noData}</p>
      )}
    </div>
  );
}

export default ContactUs;
