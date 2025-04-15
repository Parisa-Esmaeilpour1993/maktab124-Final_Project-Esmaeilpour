"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  bannerLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { uploadImage } from "@/app/services/uploadService";
import { BannerListProps, BannerProps } from "@/app/types/Banner";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import DescriptionModal from "./descriptionModal";

export default function BannerList({ banners, onRefresh }: BannerListProps) {
  const token = getAuthToken();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    order: 1,
    isActive: true,
    image: "",
    background: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(
    null
  );
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await Swal.fire({
      title: sweetAlert.areYouSure,
      text: sweetAlert.irrevocable,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: sweetAlert.yesDelete,
      cancelButtonText: sweetAlert.cancel,
    });

    if (result.isConfirmed) {
      await axios.delete(`${BASE_url}/api/records/banners/${id}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      setDeletingId(null);
      Swal.fire(sweetAlert.delete, sweetAlert.successfullyDeleted, "success");
      onRefresh();
    } else {
      setDeletingId(null);
    }
  };

  const handleEditClick = (banner: BannerProps) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      description: banner.description,
      link: banner.link,
      order: banner.order,
      isActive: banner.isActive,
      image: banner.image,
      background: banner.background,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setLoading(true);

      let updatedData = { ...formData };

      if (imageFile) {
        const newImage = await uploadImage(imageFile);
        updatedData.image = newImage;
      }

      if (bgFile) {
        const newBg = await uploadImage(bgFile);
        updatedData.background = newBg;
      }

      await axios.put(
        `${BASE_url}/api/records/banners/${editingId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire(sweetAlert.edit, sweetAlert.successfullyEdited, "success");
      setEditingId(null);
      setImageFile(null);
      setBgFile(null);
      onRefresh();
      setFormData({
        title: "",
        description: "",
        link: "",
        order: 1,
        isActive: true,
        image: "",
        background: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        sweetAlert.error,
        bannerLocalization.errorInEditBanner,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {banners.length === 0 ? (
        <div>{faLocalization.noProductFound}</div>
      ) : (
        banners.map((banner) =>
          editingId === banner.id ? (
            <form
              key={banner.id}
              onSubmit={handleEditSubmit}
              className="space-y-2 border p-4 rounded-lg"
            >
              <input
                className="border w-full p-2 rounded"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={bannerLocalization.title}
              />

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
                    setFormData({
                      ...formData,
                      image: file ? file.name : formData.image,
                    });
                  }}
                  className="hidden"
                />

                <p className="text-center text-sm text-red-500 mt-2">
                  {imageName}
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
                    setFormData({
                      ...formData,
                      background: file ? file.name : formData.background,
                    });
                  }}
                />

                <p className="text-center text-sm text-red-500 mt-2">
                  {fileName}
                </p>
              </div>
              <textarea
                name="description"
                placeholder={bannerLocalization.description}
                className="w-full border p-2 rounded"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                name="link"
                placeholder={bannerLocalization.link}
                className="w-full border p-2 rounded"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
              <input
                name="order"
                type="number"
                placeholder={bannerLocalization.order}
                className="w-full border p-2 rounded"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: +e.target.value })
                }
                title={bannerLocalization.order}
                min={1}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                {bannerLocalization.isActive}
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  {loading ? faLocalization.saving : faLocalization.save}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={() => {
                    setEditingId(null);
                    setLoading(false);
                  }}
                >
                  {sweetAlert.cancel}
                </button>
              </div>
            </form>
          ) : (
            <div
              key={banner.id}
              className="border p-4 rounded-lg bg-white shadow-md"
            >
              <div className="flex gap-2 items-center">
                <label>
                  {bannerLocalization.title}
                  {" :"}
                </label>
                <h3 className="font-semibold">{banner.title}</h3>
              </div>
              <div className="flex gap-2 items-center">
                <label>
                  {bannerLocalization.description}
                  {" :"}
                </label>
                <button
                  onClick={() => {
                    setSelectedDescription(banner.description);
                    setShowDescriptionModal(true);
                  }}
                  className="text-blue-600 underline"
                >
                  {faLocalization.show}
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <label>
                  {bannerLocalization.link}
                  {" :"}
                </label>
                <h3 className="font-semibold">{banner.link}</h3>
              </div>
              <div className="flex gap-2 items-center">
                <label>
                  {bannerLocalization.order}
                  {" :"}
                </label>
                <h3 className="font-semibold">{banner.order}</h3>
              </div>
              <div className="w-full flex flex-col lg:flex-row gap-6 justify-between my-6">
                <div className="flex gap-2 items-center">
                  <label>{bannerLocalization.mainImage}</label>
                  <img
                    src={`${BASE_url}${banner.image}`}
                    alt="Banner"
                    className="w-20 h-20 lg:w-30 lg:h-30 object-cover rounded"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label>{bannerLocalization.bgImage}</label>
                  <img
                    src={`${BASE_url}${banner.background}`}
                    alt="Background"
                    className="w-20 h-20 lg:w-30 lg:h-30 object-cover rounded"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(banner)}
                  className="bg-gray-500 text-white px-4 py-1 rounded"
                >
                  {faLocalization.edit}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="bg-gray-300 text-white px-4 py-1 rounded"
                  disabled={deletingId === banner.id}
                >
                  {deletingId === banner.id
                    ? faLocalization.deleting
                    : faLocalization.delete}
                </button>
              </div>
            </div>
          )
        )
      )}
      {showDescriptionModal && selectedDescription && (
        <DescriptionModal
          description={selectedDescription}
          onClose={() => {
            setShowDescriptionModal(false);
            setSelectedDescription(null);
          }}
        />
      )}
    </div>
  );
}
