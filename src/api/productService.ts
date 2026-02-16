import api from "./axiosInstance";
import type { Product, PageResponse, CreateProductDto } from "../types";
import { data } from "react-router-dom";

export const getProducts = (page = 0, size = 10, sort = "id,asc") => {
  return api.get<PageResponse<Product>>(
    `/products?page=${page}&size=${size}&sort=${sort}`,
  );
};
export const postProduct = (productData: CreateProductDto) => {
  return api.post<Product>(`/products`, productData);
};
export const putProduct = (
  productId: number,
  productData: CreateProductDto,
) => {
  return api.put<Product>(`/products/${productId}`, productData);
};

export const deleteProduct = (productId: number) => {
  return api.delete<Product>(`/products/${productId}`);
};

export const toggleProductStatus = (productId: number) => {
  return api.patch<Product>(`/products/${productId}/toggle-active`);
};
