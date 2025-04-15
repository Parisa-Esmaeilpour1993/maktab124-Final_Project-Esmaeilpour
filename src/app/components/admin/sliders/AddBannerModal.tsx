import { useState } from "react";
import { AddBannerModalProps } from "@/app/types/Banner";
import { addBanner } from "@/app/services/addBanners";
import {
  bannerLocalization,
  blogLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";

export default function AddBannerModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBannerModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    order: 1,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
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
      await addBanner(formData, imageFile, bgFile);
      onSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
        link: "",
        order: 1,
        isActive: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl flex flex-col gap-6">
        <h2 className="text-lg font-bold ">{bannerLocalization.addBanner}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder={bannerLocalization.title}
            className="w-full border p-2 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder={bannerLocalization.description}
            className="w-full border p-2 rounded"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <input
            name="link"
            placeholder={bannerLocalization.link}
            className="w-full border p-2 rounded"
            value={formData.link}
            onChange={handleChange}
          />
          <input
            name="order"
            type="number"
            placeholder={bannerLocalization.order}
            className="w-full border p-2 rounded"
            value={formData.order}
            onChange={handleChange}
            title={bannerLocalization.order}
            min={1}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            {bannerLocalization.isActive}
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <label
                htmlFor="imageInp"
                className="block text-center bg-blue-100 p-2 rounded-md cursor-pointer"
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
              <p className="text-center text-sm text-red-500 mt-2">
                {imageName || blogLocalization.notChoosen}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <label
                htmlFor="fileInp"
                className="block text-center bg-blue-100 p-2 rounded-md cursor-pointer"
              >
                {bannerLocalization.bgImage}
              </label>
              <input
                type="file"
                id="fileInp"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setBgFile(file);
                  setFileName(file ? file.name : "");
                }}
              />
              <p className="text-center text-sm text-red-500 mt-2">
                {fileName || blogLocalization.notChoosen}
              </p>
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? faLocalization.sending : bannerLocalization.saveBanner}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
