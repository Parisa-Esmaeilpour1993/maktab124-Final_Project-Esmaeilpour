import {
  faLocalization,
  pageLocalization,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";
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
            {pageLocalization.contactUsEdit}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary font-bold text-xl"
          >
            <IoCloseCircleSharp size={30} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {pageLocalization.address}
            </label>
            <Textarea
              name="address"
              value={formData.address}
              onChange={onChange}
              required
            />
          </div>{" "}
          <div className="mb-4">
            <Input
              label={pageLocalization.phone}
              name="phone"
              value={formData.phone}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              label={pageLocalization.email}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={onChange}
              label={pageLocalization.managerConnection}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="resumeEmail"
              value={formData.resumeEmail}
              onChange={onChange}
              label={pageLocalization.resumeEmail}
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
              className="bg-secondary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary cursor-pointer disabled:opacity-50"
            >
              {loading ? faLocalization.sending : faLocalization.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
