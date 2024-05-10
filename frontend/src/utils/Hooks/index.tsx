import { useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";

import { apiClient } from "../api";
import { apiResponse } from "../types";

import { PaginationContext } from "../../utils/PaginationContext";

export const useSneakers = (
  queryKey: string,
  page: number,
  search?: string,
  orderBy?: string,
  color?: string,
): UseQueryResult<apiResponse> => {
  const params = new URLSearchParams({
    limit: '12',
    page: page.toString(),
    ...(search && { search }),
    ...(orderBy && { orderBy }),
    ...(color && { color }),
  });

  const defaultQueryKey = `${queryKey}?${params.toString()}`;

  return useQuery(defaultQueryKey, () =>
    apiClient.get<apiResponse>(defaultQueryKey)
      .then((res) => res.data)
  );
}


export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};
