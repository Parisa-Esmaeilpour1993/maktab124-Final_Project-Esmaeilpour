"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  adminLocalization,
  faLocalization,
  loginLocalization,
  profileLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";
import { UserProps } from "@/app/types/profile";
import { confirmDelete } from "@/app/utils/sweetAlert";
import axios from "axios";
import moment from "jalali-moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  const [userData, setUserData] = useState<UserProps>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addresses: [{ id: Date.now(), value: "" }],
    birthDate: "",
    gender: "",
    phoneNumber: "",
    education: "",
  });

  const router = useRouter();

  const formatShamsiDate = (date: moment.MomentInput) => {
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userIdi = user?.userIdi;

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error(loginLocalization.loginError);
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
          addresses: Array.isArray(currentUser.addresses)
            ? currentUser.addresses
            : [],
          birthDate: currentUser.birthDate?.slice(0, 10) || "",
          gender: currentUser.gender || "",
          phoneNumber: currentUser.phoneNumber || "",
          education: currentUser.education || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(sweetAlert.error);
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
        toast.success(profileLocalization.created);
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
        toast.success(profileLocalization.edited);
        setUserData(res.data);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(sweetAlert.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = getAuthToken();
    if (!token || !userData?.id) return;

    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(`${BASE_url}/api/records/users/${userData.id}`, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(profileLocalization.deleted);
        router.push("/login");
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error(sweetAlert.error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center mx-4 border-t border-secondary h-48">
        {faLocalization.loading}{" "}
      </div>
    );

  return (
    <div className="mx-4 border-t border-secondary p-4">
      <h1 className="text-xl font-semibold mb-4">
        {profileLocalization.profile}
      </h1>
      {isEditing ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="mb-4">
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                label={adminLocalization.firstName}
              />
            </div>
            <div className="mb-6">
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                label={adminLocalization.lastName}
              />
            </div>
            <div className="mb-6">
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                label={adminLocalization.phone}
              />
            </div>

            <div className="flex flex-col mb-6">
              <label className="font-semibold text-gray-700">
                {adminLocalization.education}
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="p-2 border text-secondary border-accent rounded-md outline-none focus:ring-1 focus:ring-secondary mt-2"
              >
                <option value="">{profileLocalization.choose}</option>
                <option value={profileLocalization.underDiploma}>
                  {profileLocalization.underDiploma}{" "}
                </option>
                <option value={profileLocalization.diploma}>
                  {profileLocalization.diploma}
                </option>
                <option value={profileLocalization.associate}>
                  {profileLocalization.associate}
                </option>
                <option value={profileLocalization.bachelor}>
                  {profileLocalization.bachelor}
                </option>
                <option value={profileLocalization.master}>
                  {profileLocalization.master}
                </option>
                <option value={profileLocalization.doctora}>
                  {profileLocalization.doctora}
                </option>
              </select>
            </div>

            <div className="mb-6">
              <Input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                label={adminLocalization.age}
                className=""
              />
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                {profileLocalization.gender}
              </label>
              <div className="flex items-center gap-4">
                {[
                  {
                    label: profileLocalization.male,
                    value: profileLocalization.male,
                  },
                  {
                    label: profileLocalization.female,
                    value: profileLocalization.female,
                  },
                ].map(({ label, value }) => (
                  <label key={value} className="flex items-center gap-2 ">
                    <input
                      type="radio"
                      name="gender"
                      value={value}
                      checked={formData.gender === value}
                      onChange={handleChange}
                      className="accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 my-4">
            <div className="flex gap-4 items-center">
              <label className="font-semibold text-gray-700">
                {profileLocalization.addresses}
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    addresses: [
                      ...prev.addresses,
                      { id: Date.now(), value: "" },
                    ],
                  }));
                }}
                className=" text-gray-500"
              >
                {profileLocalization.addAddress}
              </button>
            </div>
            {formData.addresses.map((addr, index) => (
              <div key={addr.id} className="flex items-center gap-2">
                <Textarea
                  name={`address-${index}`}
                  value={addr.value}
                  onChange={(e) => {
                    const updated = [...formData.addresses];
                    updated[index].value = e.target.value;
                    setFormData((prev) => ({ ...prev, addresses: updated }));
                  }}
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.addresses.filter(
                      (_, i) => i !== index
                    );
                    setFormData((prev) => ({ ...prev, addresses: updated }));
                  }}
                  className="text-red-500"
                >
                  {sweetAlert.del}{" "}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={handleSave} children={faLocalization.save} />

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
            >
              {sweetAlert.cancel}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 mt-4 mx-8 md:mx-28 lg:mx-40">
          <div className="space-y-2">
            <p className="border-b pb-2">
              <strong>{adminLocalization.firstName}:</strong>{" "}
              {userData?.firstName}
            </p>
            <p className="border-b pb-2">
              <strong>{adminLocalization.lastName}:</strong>{" "}
              {userData?.lastName}
            </p>
            <div className="border-b pb-2">
              <strong>{profileLocalization.addresses}:</strong>
              <ul className="list-disc pr-4 mt-2">
                {userData?.addresses?.map((a: any, idx: number) => (
                  <li key={idx}>{a.value || a}</li>
                ))}
              </ul>
            </div>

            <p className="border-b pb-2">
              <strong>{adminLocalization.age} :</strong>{" "}
              {formatShamsiDate(userData?.birthDate?.slice(0, 10))}
            </p>
            <p className="border-b pb-2">
              <strong>{profileLocalization.gender}:</strong> {userData?.gender}
            </p>
            <p className="border-b pb-2">
              <strong>{adminLocalization.phone} :</strong>{" "}
              {userData?.phoneNumber}
            </p>
            <p className="border-b pb-2">
              <strong>{adminLocalization.education}:</strong>{" "}
              {userData?.education}
            </p>
          </div>
          <div className="self-end mb-6 flex items-center gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {userData?.firstName ? faLocalization.edit : faLocalization.add}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              {faLocalization.delete}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
