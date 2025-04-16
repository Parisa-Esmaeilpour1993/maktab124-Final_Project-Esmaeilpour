"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import AddProductModal from "@/app/components/admin/products/AddProductModal";
import Filters from "@/app/components/admin/products/Filters";
import Pagination from "@/app/components/admin/products/Pagination";
import ProductTable from "@/app/components/admin/products/ProductTable";
import { resetForm } from "@/app/components/admin/products/resetForm";
import ShowDetailProducts from "@/app/components/admin/products/ShowDetailProduct";
import {
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import useFetchCategories from "@/app/hooks/useCategories";
import useFilteredProducts from "@/app/hooks/useFilteredProducts";
import { AppDispatch, RootState } from "@/app/redux/store";
import { addProduct } from "@/app/services/addProducts";
import { deleteProduct } from "@/app/services/deleteProducts";
import { editProduct } from "@/app/services/editProducts";
import { fetchProducts } from "@/app/services/fetchProducts";
import { uploadImage } from "@/app/services/uploadService";
import SearchInput from "@/app/shared/SearchInput";
import { ProductsProps } from "@/app/types/products";
import {
  confirmDelete,
  successDelete,
  unSuccessDelete,
} from "@/app/utils/sweetAlert";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsPage() {
  const token = getAuthToken();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );

  const [formData, setFormData] = useState(resetForm);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const filteredProducts = useFilteredProducts({
    products,
    searchTerm,
    filterCategory,
    filterStock,
    sortOption,
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductsProps | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { categories } = useFetchCategories();

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts());
    }
  }, [token, dispatch]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const checkDuplicateProduct = (productName: string) => {
    return products.some(
      (product) =>
        product.productName.toLowerCase() === productName.toLowerCase()
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error(productsLocalization.addImagePlease);
      return;
    }
    try {
      if (editId) {
        await dispatch(
          editProduct({
            ...formData,
            id: editId,
            productPrice: Number(formData.productPrice),
            productQuantity: Number(formData.productQuantity),
          })
        );
        toast.success(sweetAlert.successfullyEdited);
        setEditId(null);
      } else {
        if (checkDuplicateProduct(formData.productName)) {
          toast.error(productsLocalization.repetitive);
          return;
        }
        await dispatch(
          addProduct({
            ...formData,
            productPrice: Number(formData.productPrice),
            productQuantity: Number(formData.productQuantity),
          })
        );
        toast.success(sweetAlert.seccessfullyAdded);
      }
      setFormData(resetForm);
      setFileName(null);
      setIsModalOpen(false);
    } catch {
      toast.error(productsLocalization.errorInSendingData);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await dispatch(deleteProduct(id));
        await successDelete();
      } catch {
        await unSuccessDelete();
      }
    }
  };

  const handleInlineEdit = async (id: string, field: string, value: string) => {
    try {
      const productToEdit = products.find((p) => p.id === id);
      if (!productToEdit) return;
      const updatedProduct: ProductsProps = {
        ...productToEdit,
        [field]:
          field === "productPrice" || field === "productQuantity"
            ? Number(value)
            : value,
      };
      await dispatch(editProduct(updatedProduct));
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <ToastContainer />
      <div className="flex flex-col items-center gap-4 justify-between">
        <div className="flex flex-col w-full justify-between lg:flex-row gap-4 items-center">
          <button
            onClick={() => {
              setFormData(resetForm);
              setFileName(null);
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="flex gap-2 items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition active:scale-95"
          >
            <FaPlus />
            {productsLocalization.addProduct}
          </button>

          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Filters
          filterCategory={filterCategory}
          filterStock={filterStock}
          sortOption={sortOption}
          setFilterCategory={setFilterCategory}
          setFilterStock={setFilterStock}
          setSortOption={setSortOption}
          category={categories}
        />
      </div>

      {loading ? (
        <div className="w-full text-center py-10 text-lg font-semibold flex items-center justify-center gap-2">
          <div className="w-6 h-6 border-t-4 border-blue-500 border-solid rounded-full animate-spin "></div>
          {productsLocalization.loading}...
        </div>
      ) : (
        <ProductTable
          products={paginatedProducts}
          category={categories}
          handleDelete={handleDelete}
          onEditClick={(product) => {
            setFormData({
              ...product,
              productPrice: product.productPrice.toString(),
              productQuantity: product.productQuantity.toString(),
            });
            setFileName(product.image.split("/").pop() ?? null);
            setIsModalOpen(true);
            setEditId(product.id);
          }}
          onDetailClick={(product) => {
            setSelectedProduct(product);
            setIsDetailModalOpen(true);
          }}
          onInlineEdit={handleInlineEdit}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onFileChange={handleFileChange}
          fileName={fileName}
          loading={loading}
          category={categories}
          editId={editId}
        />
      )}

      {isDetailModalOpen && selectedProduct && (
        <ShowDetailProducts
          selectedProduct={selectedProduct}
          category={categories}
          setIsDetailModalOpen={setIsDetailModalOpen}
        />
      )}
    </div>
  );
}
