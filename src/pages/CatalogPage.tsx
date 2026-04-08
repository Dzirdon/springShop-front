import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productService";
import { addToCart } from "../api/cartService";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import toast from "react-hot-toast";

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки товаров:", err);
        setLoading(false);
      });
    console.log(products);
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      toast.success("Товар добавлен в корзину! 🛒", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);
      alert("Не удалось добавить товар. Возможно, нужно перелогиниться.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Витрина товаров</h2>
        <p className="text-gray-500 mt-2">
          Выберите лучшие товары для вашего заказа
        </p>
      </header>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products?.length > 0 ? (
          products.map((product) =>
            product.stockQuantity <= 0 ? (
              ""
            ) : (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ),
          )
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400">
              Товары не найдены. Добавьте их через админку.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
