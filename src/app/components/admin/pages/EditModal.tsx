import { IoCloseCircleSharp } from "react-icons/io5";
import React, { useEffect } from "react";
import {
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize.configure({
        types: ["textStyle"],
      }),
      Underline,
      TextAlign.configure({ types: ["paragraph"] }),
      Color,
    ],
    content: formData.description,
    onUpdate: ({ editor }) => {
      onChange({
        target: {
          name: "description",
          value: editor.getHTML(),
        },
      });
    },
  });

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();

  const toggleAlignLeft = () =>
    editor?.chain().focus().setTextAlign("left").run();
  const toggleAlignCenter = () =>
    editor?.chain().focus().setTextAlign("center").run();
  const toggleAlignRight = () =>
    editor?.chain().focus().setTextAlign("right").run();

  const setFontSize = (size: string) =>
    editor?.chain().focus().setFontSize(size).run();

  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();

  const setColor = (color: string) =>
    editor?.chain().focus().setColor(color).run();

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(formData.description);
    }
  }, [formData.description, editor]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-2/3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-primary">
            {faLocalization.edit}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary font-bold text-xl cursor-pointer"
          >
            <IoCloseCircleSharp size={30} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              عنوان
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full border rounded-lg p-2 text-sm text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={toggleBold}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                <FaBold />
              </button>
              <button
                type="button"
                onClick={toggleItalic}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                <FaItalic />
              </button>
              <button
                type="button"
                onClick={toggleUnderline}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                <FaUnderline />
              </button>
              <button
                type="button"
                onClick={toggleAlignLeft}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                چپ چین
              </button>
              <button
                type="button"
                onClick={toggleAlignCenter}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                وسط چین
              </button>
              <button
                type="button"
                onClick={toggleAlignRight}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                راست چین
              </button>
              <button
                type="button"
                onClick={() => setFontSize("18px")}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                سایز فونت
              </button>
              <button
                type="button"
                onClick={toggleBulletList}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                لیست گلوله‌ای
              </button>
              <button
                type="button"
                onClick={toggleOrderedList}
                className="text-lg p-2 border rounded hover:bg-gray-200"
              >
                لیست عددی
              </button>

              <input
                type="color"
                onChange={(e) => setColor(e.target.value)}
                title="رنگ متن"
                className="w-10 h-10 p-0 border rounded cursor-pointer"
              />
            </div>
            <div className="w-full border rounded-lg p-2 text-sm text-gray-700">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-300"
            >
              {sweetAlert.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary disabled:opacity-50"
            >
              {loading ? faLocalization.sending : faLocalization.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
