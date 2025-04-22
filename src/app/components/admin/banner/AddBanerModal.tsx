import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  bannerLocalization,
  blogLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { addHeroBanner } from "@/app/services/addHeroBanner";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";
import { AddBannerModalProps } from "@/app/types/Banner";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export default function AddBannerModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBannerModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const token = getAuthToken();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await fetch(`${BASE_url}/api/records/heroBanner`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      await addHeroBanner(formData, imageFile);
      onSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
      });
      setImageName("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl flex flex-col gap-6">
          <h2 className="text-lg font-bold text-secondary">
            {bannerLocalization.addBanner}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder={bannerLocalization.title}
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder={bannerLocalization.description}
              value={formData.description}
              onChange={handleChange}
            />

            <div className="flex gap-4 items-center">
              <label
                htmlFor="imageInp"
                className="block text-center bg-accent p-2 rounded-md cursor-pointer"
              >
                {bannerLocalization.mainImage}
              </label>
              <input
                type="file"
                id="imageInp"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setImageName(file ? file.name : "");
                }}
                className="hidden"
              />
              <p className="text-center text-sm text-red-600 mt-2">
                {imageName || blogLocalization.notChoosen}
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                {sweetAlert.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-secondary hover:bg-primary text-white rounded disabled:opacity-50"
              >
                {loading
                  ? faLocalization.sending
                  : bannerLocalization.saveBanner}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
