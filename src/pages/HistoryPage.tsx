import React, { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderService";
import type { Order } from "../types";

export const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center py-10">Загрузка истории...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">
        История заказов
      </h1>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                    Заказ #{order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                    {order.status}
                  </span>
                  <p className="text-xl font-black text-gray-900 mt-1">
                    {order.totalPrice} ₽
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex gap-3">
                      <span className="text-gray-400 font-medium">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {item.product.name}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {item.priceAtPurchase} ₽ / шт.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">Вы еще ничего не заказывали</p>
          </div>
        )}
      </div>
    </div>
  );
};
