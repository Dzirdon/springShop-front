import React, { useState, useEffect } from "react";
import type { Product } from "../types";
import { getProducts } from "../api/productService";
import ProductsManager from "../components/ProductsManager";

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<string>("id,desc");

  const fetchPrducts = () => {
    getProducts(0, 50, sortConfig)
      .then((res) => {
        setProducts(res.data.content || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки товаров:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrducts();
  }, [sortConfig]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">
          Панель управления 🛡️
        </h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "products" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500"}`}
          >
            Товары
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "orders" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500"}`}
          >
            Заказы
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === "products" ? (
          <ProductsManager
            products={products}
            loading={loading}
            onProductAdded={fetchPrducts}
            onSortChange={setSortConfig}
            sortConfig={sortConfig}
          />
        ) : (
          <OrdersManager />
        )}
      </div>
    </div>
  );
};

// Подкомпонент управления товарами

const OrdersManager = () => (
  <div className="p-6 text-center text-gray-500">
    Раздел управления заказами в разработке...
  </div>
);
