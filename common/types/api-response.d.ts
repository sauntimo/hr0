import { AppError } from "./error";

interface ApiResponseBase {
  success: boolean;
}

// This will only have a data prop if a type is specified for it
export type ApiResponseSuccess<T = never> = ApiResponseBase & {
  success: true;
} & ([T] extends [never] ? { data?: never } : { data: T });

export interface ApiResponseFailure extends ApiResponseBase {
  success: false;
  error: AppError;
}

export type ApiResponse<T = never> = ApiResponseSuccess<T> | ApiResponseFailure;

export type ApiResponseAndStatus<T = never> = ApiResponse<T> & {
  statusCode: number;
};
