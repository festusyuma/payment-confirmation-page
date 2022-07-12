import {ApiResponse, Transaction} from "~/types";

export const useTransaction = (reference: string) => {
  const config = useRuntimeConfig()

  return useLazyFetch<ApiResponse<Transaction>>(
    `/transaction/status?reference=${reference}&`,
    { baseURL: config.baseUrl }
  )
}