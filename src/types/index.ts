export interface User {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  active: boolean;
}

export interface LoginResponse {
  token: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

export interface CartItemDto {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface CartResponseDto {
  items: CartItemDto[];
  totalSum: number;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}
export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  priceAtPurchase: number; 
  quantity: number;
}
export interface OrderResponseDto {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string; 
  items: OrderItemDto[];
}

export interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface MyTokenPayload {
  sub: string; 
  exp: number; 
  iat: number;
  role: string;

  
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}
