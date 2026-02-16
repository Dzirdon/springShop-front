import React, { useEffect, useState } from "react";
import {
  getMyCart,
  checkout,
  deleteProductFromCart,
  addToCart,
  decreaceProductFromcart,
} from "../api/cartService";
import type {
  CartItemDto,
  CartResponseDto,
  Order,
  PageResponse,
  Product,
} from "../types";
import { getProducts } from "../api/productService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const CartPage: React.FC = () => {
  const [products, setProducts] = useState<PageResponse<Product> | null>(null);
  const [cart, setCart] = useState<CartResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadCart = () => {
    getMyCart()
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadProducts = () => {
    getProducts().then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(() => {
    loadCart();
    loadProducts();
  }, []);

  const handleCheckout = async (cart: CartResponseDto) => {
    try {
      setLoading(true);

      // const currentProds = cart.items.filter((product) =>
      //   products?.content.filter((stock) => stock.name === product.productName),
      // );

      // try {
      //   currentProds.forEach(
      //     async (prod) => await addToCart(prod.productId, prod.quantity - 1),
      //   );
      // } catch (error: any) {
      //   alert(error + " Ошибка в добавлении в корзину");
      // }

      // 1. Вызываем бэкенд
      const newOrder = await checkout();

      // 2. Если всё ок — очищаем корзину в стейте
      setCart(null);

      toast.success(`Заказ №${newOrder.id} успешно оформлен!`, {
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
    } catch (error: any) {

      const message = error.response?.data?.message || "Ошибка при оформлении";
      alert(message);
    } finally {
      setLoading(false);
      navigate("/history");
    }
  };

  const handleUpdateQuantity = async (
    item: CartItemDto,
    action: "plus" | "minus",
  ) => {

    setCart((prevCart) => {
      if (!prevCart) return null;

      const updatedItems = [...prevCart.items];
      const index = updatedItems.findIndex(
        (cartItem) => cartItem.productName === item.productName,
      );

      if (index === -1) return prevCart;

      const currentItem = updatedItems[index];
      let newQuantity = currentItem.quantity;

      if (action === "plus") {
        newQuantity += 1;
      } else {
        if (newQuantity <= 1) {
          const filteredItems = updatedItems.filter(
            (i) => i.productName !== item.productName,
          );
          return {
            ...prevCart,
            items: filteredItems,
            totalSum: Number(
              filteredItems
                .reduce((sum, i) => sum + i.price * i.quantity, 0)
                .toFixed(2),
            ),
          };
        }
        newQuantity -= 1;
      }

      updatedItems[index] = {
        ...currentItem,
        quantity: newQuantity,
        subTotal: Number((newQuantity * currentItem.price).toFixed(2)),
      };

      return {
        ...prevCart,
        items: updatedItems,
        totalSum: Number(
          updatedItems
            .reduce((sum, i) => sum + i.price * i.quantity, 0)
            .toFixed(2),
        ),
      };
    });


    try {
      if (action === "plus") {
        await addToCart(item.productId, 1);
      } else {
        
        await decreaceProductFromcart(item.productId);
      }
    } catch (error) {
      console.error("Ошибка при обновлении корзины:", error);

    }
  };

  if (loading)
    return <div className="text-center py-10">Загрузка корзины...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <span className="text-6xl mb-4 block">🛒</span>
        <h2 className="text-2xl font-bold text-gray-800">Корзина пуста</h2>
        <p className="text-gray-500 mt-2">Время что-нибудь купить!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Ваша корзина</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">
                  📦
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.price.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}{" "}
                    x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right flex w-38  justify-between items-center">
                <p className="font-black text-indigo-600">
                  {" "}
                  {item.subTotal.toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  })}{" "}
                  ₽
                </p>
                <div className="flex justify-between w-1/2 ml-2 rounded-2xl border px-2 py-4">
                  <button onClick={() => handleUpdateQuantity(item, "plus")}>
                    +
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item, "minus")}>
                    -
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">
              Итого к оплате
            </p>
            <p className="text-4xl font-black text-gray-900">
              {cart.totalSum.toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
              })}{" "}
            </p>
          </div>
          <button
            onClick={() => handleCheckout(cart)}
            disabled={loading || !cart?.items.length}
          >
            {loading ? "Оформляем..." : "Оформить заказ"}
          </button>
        </div>
      </div>
    </div>
  );
};
