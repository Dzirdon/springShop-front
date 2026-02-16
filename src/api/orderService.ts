import api from "./axiosInstance";
import type { Order } from "../types";

export const getMyOrders = () => {
  return api.get<Order[]>("/orders/my");
};
