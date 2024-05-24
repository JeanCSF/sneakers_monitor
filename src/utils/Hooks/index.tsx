import { useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";

import { apiClient } from "../api";
import { apiResponse } from "../types";

import { PaginationContext } from "../Contexts/PaginationContext";
import { CategoriesContext } from "../Contexts/CategoriesContext";
import { LoadingContext } from "../Contexts/LoadingContext";

export const useSneakers = (
  queryKey: string,
  page: number,
  search?: string,
  orderBy?: string,
  colors?: string[],
  sizes?: string[],
  categories?: string[],
  stores?: string[],
  brands?: string[],
  minPrice?: string,
  maxPrice?: string
): UseQueryResult<apiResponse> => {
  const params = new URLSearchParams({
    limit: '12',
    page: page.toString(),
    ...(search && { search }),
    ...(orderBy && { orderBy }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
  });

  if (colors && colors.length > 0) {
    colors.forEach((color) => {
      params.append('color', color);
    });
  }

  if (sizes && sizes.length > 0) {
    sizes.forEach((size) => {
      params.append('size', size.toString());
    });
  }

  if (categories && categories.length > 0) {
    categories.forEach((category) => {
      params.append('category', category);
    });
  }

  if (stores && stores.length > 0) {
    stores.forEach((store) => {
      params.append('store', store);
    });
  }

  if (brands && brands.length > 0) {
    brands.forEach((brand) => {
      params.append('brand', brand);
    });
  }

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

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
