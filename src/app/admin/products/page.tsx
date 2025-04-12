"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import SearchInput from "@/app/shared/SearchInput";
import { Category } from "@/app/types/category";
import AddProductModal from "@/app/components/products/AddProductModal";
import { ProductsProps } from "@/app/types/products";
import ProductTable from "@/app/components/products/ProductTable";
import Pagination from "@/app/components/products/Pagination";
import ShowDetailProducts from "@/app/components/products/ShowDetailProduct";

export default function ProductsPage() {
  const [formData, setFormData] = useState({
    productName: "",
    productCategory: "",
    productPrice: "",
    productQuantity: "",
    productDescription: "",
    productSpecifications: "",
    productExpired: "",
    image: "",
  });

  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductsProps[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductsProps | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const token = getAuthToken();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_url}/api/records/drugs`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProducts(response.data?.records || []);
      } else {
        toast.error("دریافت محصولات با خطا مواجه شد");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("خطا در دریافت محصولات");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_url}/api/records/category`, {
          headers: {
            api_key: API_KEY,
          },
        });

        if (response.status === 200) {
          setCategory(response.data.records || []);
        }
      } catch (error) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (filterCategory !== "all")
      filtered = filtered.filter((p) => p.productCategory === filterCategory);

    if (filterStock === "low")
      filtered = filtered.filter(
        (p) => +p.productQuantity < 10 && +p.productQuantity > 0
      );
    else if (filterStock === "enough")
      filtered = filtered.filter((p) => +p.productQuantity >= 10);
    else if (filterStock === "unavailable")
      filtered = filtered.filter((p) => +p.productQuantity === 0);

    if (sortOption === "az")
      filtered.sort((a, b) => a.productName.localeCompare(b.productName, "fa"));
    else if (sortOption === "za")
      filtered.sort((a, b) => b.productName.localeCompare(a.productName, "fa"));
    else if (sortOption === "newest")
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    else if (sortOption === "oldest")
      filtered.sort((a, b) => a.id.localeCompare(b.id));

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, filterCategory, filterStock, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${BASE_url}/api/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data?.downloadLink || null;
    } catch (error) {
      toast.error("آپلود تصویر با خطا مواجه شد");
      return null;
    }
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
      toast.error("لطفاً تصویر را بارگذاری کنید");
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${BASE_url}/api/records/drugs/${editId}`, formData, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("محصول با موفقیت ویرایش شد");
        fetchProducts();
        setEditId(null);
      } else {
        if (checkDuplicateProduct(formData.productName)) {
          toast.error("محصول با این نام قبلاً موجود است");
          return;
        }
        await axios.post(`${BASE_url}/api/records/drugs`, formData, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("محصول با موفقیت اضافه شد");
      }

      setFormData({
        productName: "",
        productCategory: "",
        productPrice: "",
        productQuantity: "",
        productDescription: "",
        productSpecifications: "",
        productExpired: "",
        image: "",
      });
      setFileName(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("مشکلی در ارسال اطلاعات پیش آمده");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "آیا از حذف مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "حذف",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_url}/api/records/drugs/${id}`, {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("حذف شد!", "محصول حذف شد.", "success");
        fetchProducts();
      } catch (err) {
        Swal.fire("خطا", "خطا در حذف محصول", "error");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <ToastContainer />
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
        <button
          onClick={() => {
            setFormData({
              productName: "",
              productCategory: "",
              productPrice: "",
              productQuantity: "",
              productDescription: "",
              productSpecifications: "",
              productExpired: "",
              image: "",
            });
            setFileName(null);
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="flex gap-2 items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition active:scale-95"
        >
          <FaPlus />
          افزودن محصول
        </button>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-2 py-1 rounded-md"
          >
            <option value="all">همه دسته‌ها</option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
          <option value="" disabled hidden>
            انتخاب دسته‌بندی
          </option>

          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="border px-2 py-1 rounded-md"
          >
            <option value="all">همه موجودی‌ها</option>
            <option value="unavailable">ناموجود </option>
            <option value="low">کمتر از 10</option>
            <option value="enough">10 یا بیشتر</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-2 py-1 rounded-md"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="az">مرتب A-Z</option>
            <option value="za">مرتب Z-A</option>
          </select>
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        category={category}
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
      />

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
          category={category}
          editId={editId}
        />
      )}
      {isDetailModalOpen && selectedProduct && (
        <ShowDetailProducts
          selectedProduct={selectedProduct}
          category={category}
          setIsDetailModalOpen={setIsDetailModalOpen}
        />
      )}
    </div>
  );
}
