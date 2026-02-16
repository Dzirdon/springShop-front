import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  deleteProduct,
  postProduct,
  putProduct,
  toggleProductStatus,
} from "../api/productService";
import type { Product } from "../types";

export interface ProductsManagerProps {
  products: Product[];
  loading: boolean;
  onProductAdded: () => void;
  onSortChange: (config: string) => void;
  sortConfig: string;
}

const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  loading,
  onProductAdded,
  onSortChange,
  sortConfig,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
    setIsModalOpen(true);
  };

  const renderSortIcon = (field: string) => {
    const [currentField, currentDir] = sortConfig.split(",");
    if (currentField !== field) return <span className="opacity-20">↕</span>;
    return currentDir === "asc" ? " 🔼" : " 🔽";
  };

  const toggleSort = (field: string) => {
    const [currentField, currentDir] = sortConfig.split(",");
    if (currentField === field) {
      onSortChange(`${field},${currentDir === "asc" ? "desc" : "asc"}`);
    } else {
      onSortChange(`${field},asc`);
    }
  };

  const handleToggleStatus = async (productId: number) => {
    try {
      await toggleProductStatus(productId);
      toast.success("Статус товара обновлен");
      onProductAdded()
    } catch (error) {
      toast.error("Ошибка при обновлении статуса");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {

        await putProduct(editingId, formData);
        toast.success("Товар обновлен! 📝");
      } else {
        await postProduct(formData);
        toast.success("Товар добавлен! 🛒");
      }


      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", description: "", price: 0, stockQuantity: 0 });
      onProductAdded();
    } catch (error) {
      toast.error("Ошибка при сохранении");
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
  
    const confirmed = window.confirm(
      `Вы уверены, что хотите отправить товар "${productName}" в архив? Пользователи больше не смогут его купить.`,
    );

    if (!confirmed) return;

    try {

      await toggleProductStatus(productId);

  
      toast.success(`Товар "${productName}" успешно архивирован`);

      onProductAdded();
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Ошибка при архивации товара";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Список товаров</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
        >
          + Добавить товар
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black text-gray-900">
                  Новый товар 📦
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                  Название
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Механическая клавиатура"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  placeholder="Введите описание товара..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                    Цена (₽)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                    Склад (шт)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th
                onClick={() => toggleSort("id")}
                className="px-4 py-3 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                ID {renderSortIcon("id")}
              </th>
              <th
                onClick={() => toggleSort("name")}
                className="px-4 py-3 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                Название {renderSortIcon("name")}
              </th>
              <th
                onClick={() => toggleSort("price")}
                className="px-4 py-3 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                Цена {renderSortIcon("price")}
              </th>
              <th
                onClick={() => toggleSort("stockQuantity")}
                className="px-4 py-3 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                Склад {renderSortIcon("stockQuantity")}
              </th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                
                className={`transition-all ${!product.active ? "bg-gray-100/50 opacity-60" : "hover:bg-gray-50/50"}`}
              >
                <td className="px-6 py-4 text-sm text-gray-400">
                  #{product.id}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={`font-bold ${!product.active ? "text-gray-500" : "text-gray-700"}`}
                    >
                      {product.name}
                    </span>
                   
                    {!product.active && (
                      <span className="text-[10px] font-black text-red-500 uppercase">
                        Архив
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-medium">
                  {product.price} ₽
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      product.active
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {product.stockQuantity} шт.
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    {product.active ? (
                      <>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-indigo-600 font-bold text-sm hover:underline"
                        >
                          Изменить
                        </button>

                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-500 font-bold text-sm hover:underline"
                        >
                          Удалить
                        </button>
                      </>
                    ) : (
  
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className="text-green-600 font-bold text-sm hover:underline"
                      >
                        Восстановить
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="text-center p-10 text-gray-400">
            Загрузка данных...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManager;
