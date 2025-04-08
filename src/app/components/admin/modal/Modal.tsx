import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed h-full inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg w-4/5 md:w-1/2 lg:w-1/2 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        ></button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
