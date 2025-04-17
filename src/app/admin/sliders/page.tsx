"use client";

import AddBannerModal from "@/app/components/admin/sliders/AddBannerModal";
import BannerList from "@/app/components/admin/sliders/BannerList";
import { bannerLocalization } from "@/app/constants/localization/fa/localization";
import { fetchBanners } from "@/app/services/fetchBanners";
import Button from "@/app/shared/Button";
import { BannerProps } from "@/app/types/Banner";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function BannerAdminPage() {
  const [showModal, setShowModal] = useState(false);
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    const data = await fetchBanners();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  return (
    <>
      <Button
        children={bannerLocalization.addBanner}
        onClick={() => setShowModal(true)}
        className="!bg-primary"
      />

      <AddBannerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadBanners}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ClipLoader color="#2563eb" size={50} />
        </div>
      ) : (
        <BannerList banners={banners} onRefresh={loadBanners} />
      )}
    </>
  );
}
