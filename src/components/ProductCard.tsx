import React from "react";
import type { Product } from "../types";

interface Props {
  product: Product;
  onAddToCart: (id: number) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="h-40 bg-gray-50 rounded-lg mb-4 flex items-center justify-center text-4xl">
      📦
    </div>
    <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
      {product.description}
    </p>
    <div className="flex justify-between items-center">
      <span className="text-xl font-bold text-indigo-600">
        {product.price} ₽
      </span>
      <span>Остатки на скаладе: {product.stockQuantity}</span>
      <button
        onClick={() => onAddToCart(product.id)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        В корзину
      </button>
    </div>
  </div>
);
