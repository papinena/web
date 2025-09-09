import type { Pagination } from "./pagination";

export type ApiResponseStatus = "success" | "error";

export type ApiResponseMessage = string;

export type ApiResponse<T> = {
  status: ApiResponseStatus;
  message: ApiResponseMessage;
  data: T;
};

export type PaginatedApiResponse<T> = {
  status: ApiResponseStatus;
  message: ApiResponseMessage;
  data: T;
  pagination: Pagination;
};
