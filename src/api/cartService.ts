import type { CartResponseDto, Order, OrderResponseDto } from "../types";
import api from "./axiosInstance";

export const addToCart = (productId: number, quantity: number = 1) => {
  return api.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
};

export const getCart = () => {
  return api.get("/cart");
};

export const getMyCart = () => {
  return api.get<CartResponseDto>("/cart");
};

export const checkout = async (): Promise<OrderResponseDto> => {
  const response = await api.post("/orders/checkout");
  return response.data;
};
export const deleteProductFromCart = (productId: number) => {
  return api.delete(`/cart/remove/${productId}`);
};
export const decreaceProductFromcart = (productId: number) => {
  return api.patch(`/cart/decrease/${productId}`); 
};
