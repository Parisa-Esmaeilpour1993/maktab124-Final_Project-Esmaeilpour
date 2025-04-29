"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface userProps {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  education: string;
}

function Profile() {
  const [userData, setUserData] = useState<userProps>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    education: "",
  });

  const router = useRouter();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userIdi = user?.userIdi;

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("برای ادامه باید وارد شوید!");
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BASE_url}/api/records/users`, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        const users = res.data.records;
        const currentUser = users.find((u: any) => u.userIdi === userIdi);
        if (!currentUser) {
          setIsEditing(true);
          return;
        }

        setUserData(currentUser);
        setFormData({
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          address: currentUser.address || "",
          birthDate: currentUser.birthDate?.slice(0, 10) || "",
          gender: currentUser.gender || "",
          phoneNumber: currentUser.phoneNumber || "",
          education: currentUser.education || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("دریافت اطلاعات با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) return;
    setLoading(true);

    try {
      if (!userData?.id) {
        const res = await axios.post(
          `${BASE_url}/api/records/users`,
          {
            ...formData,
            userIdi,
          },
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("پروفایل با موفقیت ایجاد شد!");
        setUserData(res.data);
      } else {
        const res = await axios.put(
          `${BASE_url}/api/records/users/${userData.id}`,
          {
            ...formData,
            userIdi,
          },
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("پروفایل با موفقیت ویرایش شد!");
        setUserData(res.data);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("ذخیره پروفایل با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = getAuthToken();
    if (!token || !userData?.id) return;

    if (!confirm("آیا از حذف پروفایل خود مطمئن هستید؟")) return;

    try {
      setLoading(true);
      await axios.delete(`${BASE_url}/api/records/users/${userData.id}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("پروفایل حذف شد.");
      router.push("/login");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("خطا در حذف پروفایل.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center mx-4 border-t border-secondary h-48">
        در حال بارگذاری...
      </div>
    );

  return (
    <div className="container mx-4 border-t border-secondary p-4">
      <h1 className="text-xl font-semibold mb-4">پروفایل کاربری</h1>
      {isEditing ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              label="نام"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              label="نام خانوادگی"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              label="آدرس"
            />
          </div>
          <div className="mb-4">
            <Input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              label="تاریخ تولد"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-gray-700">جنسیت</label>
            <div className="flex items-center gap-4">
              {[
                { label: "مرد", value: "مرد" },
                { label: "زن", value: "زن" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2 ">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={formData.gender === value}
                    onChange={handleChange}
                    className=""
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              label="شماره تماس"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-gray-700">تحصیلات</label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="p-2 border text-secondary border-accent rounded-md outline-none focus:ring-1 focus:ring-secondary w-full mt-2"
            >
              <option value="">انتخاب کنید</option>
              <option value="زیر دیپلم">زیر دیپلم</option>
              <option value="دیپلم">دیپلم</option>
              <option value="کاردانی">کاردانی</option>
              <option value="کارشناسی">کارشناسی</option>
              <option value="کارشناسی ارشد">کارشناسی ارشد</option>
              <option value="دکترا">دکترا</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} children=" ذخیره" />

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
            >
              انصراف
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 mt-4 mr-40">
          <div className="space-y-2">
            <p className="border-b pb-2">
              <strong>نام:</strong> {userData?.firstName}
            </p>
            <p className="border-b pb-2">
              <strong>نام خانوادگی:</strong> {userData?.lastName}
            </p>
            <p className="border-b pb-2">
              <strong>آدرس:</strong> {userData?.address}
            </p>
            <p className="border-b pb-2">
              <strong>تاریخ تولد:</strong> {userData?.birthDate?.slice(0, 10)}
            </p>
            <p className="border-b pb-2">
              <strong>جنسیت:</strong> {userData?.gender}
            </p>
            <p className="border-b pb-2">
              <strong>شماره تماس:</strong> {userData?.phoneNumber}
            </p>
            <p className="border-b pb-2">
              <strong>تحصیلات:</strong> {userData?.education}
            </p>
          </div>
          <div className="self-end mb-4 flex items-center gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {userData?.firstName ? "ویرایش" : "افزودن"}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
