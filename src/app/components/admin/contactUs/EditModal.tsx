import { IoCloseCircleSharp } from "react-icons/io5";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    email: string;
    phone: number;
    managerEmail: string;
    resumeEmail: string;
    address: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-2/3 lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            ویرایش تماس با ما
          </h3>
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
              آدرس
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={onChange}
              rows={4}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
              required
            />
          </div>{" "}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تماس
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ارتباط با مدیریت
            </label>
            <input
              type="text"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={onChange}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ارسال رزومه
            </label>
            <input
              type="text"
              name="resumeEmail"
              value={formData.resumeEmail}
              onChange={onChange}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
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
