import {
  bannerLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import React from "react";

function DescriptionModal({
  description,
  onClose,
}: {
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 md:w-2/3 lg:w-1/2 shadow-xl h-1/2 flex flex-col">
        <h2 className="text-lg font-semibold mb-2">
          {bannerLocalization.description}
        </h2>

        <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4">
          <p className="text-sm whitespace-pre-wrap break-words">
            {description}
          </p>
        </div>

        <div className="text-right">
          <button className="bg-gray-300 px-4 py-1 rounded" onClick={onClose}>
            {sweetAlert.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DescriptionModal;
