import { IoCloseCircleSharp } from "react-icons/io5";
import React from "react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    title: string;
    description: string;
  };
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function EditModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  loading,
}: EditModalProps) {
  if (!isOpen) return null;

  const handleDescriptionChange = (value: string) => {
    onChange({ target: { name: "description", value } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-2/3 lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">ویرایش</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 font-bold text-xl"
          >
            <IoCloseCircleSharp size={30} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={5}
              className="w-full border rounded-lg p-2 text-sm text-gray-700 resize-y"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-300"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "در حال ارسال..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
