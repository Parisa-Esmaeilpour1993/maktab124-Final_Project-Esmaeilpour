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

import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";
import { confirmDelete, successDelete } from "@/app/utils/sweetAlert";
import DescriptionModal from "./BannerModal";

export default function BannerList({ banners, onRefresh }: BannerListProps) {
  const token = getAuthToken();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(
    null
  );
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await confirmDelete();

    if (result.isConfirmed) {
      await axios.delete(`${BASE_url}/api/records/heroBanner/${id}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      setDeletingId(null);
      await successDelete();
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
      image: banner.image,
    });

    setImageName(banner.image.split("/").pop() || "");
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
      await axios.put(
        `${BASE_url}/api/records/heroBanner/${editingId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: sweetAlert.edit,
        text: sweetAlert.successfullyEdited,
        icon: "success",
        confirmButtonText: sweetAlert.okay,
      });
      setEditingId(null);
      setImageFile(null);
      onRefresh();
      setFormData({
        title: "",
        description: "",
        image: "",
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
              className="space-y-2 border p-4 border-primary rounded-lg"
            >
              <Input
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
                    setFormData({
                      ...formData,
                      image: file ? file.name : formData.image,
                    });
                  }}
                  className="hidden"
                />
                <p className="text-center text-sm text-red-600 mt-2">
                  {imageName}
                </p>
              </div>
              <Textarea
                name="description"
                placeholder={bannerLocalization.description}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="bg-secondary hover:bg-primary cursor-pointer text-white px-4 py-1 rounded"
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
              className="border border-primary p-4 rounded-lg bg-light/20 shadow-md"
            >
              <div className="flex flex-col mb-6 md:mb-0 md:flex-row gap-2">
                <label className="font-semibold">
                  {bannerLocalization.title}
                  {" :"}
                </label>
                <h3>{banner.title}</h3>
              </div>
              <div className="flex gap-2 items-center">
                <label className="font-semibold">
                  {bannerLocalization.description}
                  {" :"}
                </label>
                <button
                  onClick={() => {
                    setSelectedDescription(banner.description);
                    setShowDescriptionModal(true);
                  }}
                  className="text-secondary hover:text-primary underline"
                >
                  {faLocalization.show}
                </button>
              </div>

              <div className="flex items-center justify-between gap-24 mt-6">
                <div className="flex gap-2 items-center">
                  <label className="font-semibold">
                    {bannerLocalization.mainImage}
                  </label>
                  <img
                    src={`${BASE_url}${banner.image}`}
                    alt="Banner"
                    className="w-20 h-20 lg:w-30 lg:h-30 object-cover rounded"
                  />
                </div>
                <div className="flex gap-2 self-end">
                  <Button
                    onClick={() => handleEditClick(banner)}
                    children={faLocalization.edit}
                  />
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-white px-4 py-1 rounded"
                    disabled={deletingId === banner.id}
                  >
                    {deletingId === banner.id
                      ? faLocalization.deleting
                      : faLocalization.delete}
                  </button>
                </div>
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
