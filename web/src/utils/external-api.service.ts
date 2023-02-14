import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import type {
  ApiResponse,
  ApiResponseSuccess,
} from "../../../common/types/api-response";
import type { AppError } from "../../../common/types/error";

export const callExternalApi = async <T>(options: {
  config: AxiosRequestConfig;
}): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axios(options.config);
    const { data } = response;

    return data as unknown as ApiResponseSuccess<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      const { response } = axiosError;

      let message = "http request failed";

      if (response && response.statusText) {
        message = response.statusText;
      }

      if (axiosError.message) {
        message = axiosError.message;
      }

      if (response?.data && (response.data as AppError).message) {
        message = (response.data as AppError).message;
      }

      return {
        success: false,
        error: { message },
      };
    }

    return {
      success: false,
      error: { message: (error as Error).message },
    };
  }
};
