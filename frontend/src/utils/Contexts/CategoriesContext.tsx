import { createContext, useState, useEffect } from "react";
import { apiClient } from "../api";
import { Item } from "../types";

interface CategoriesContextData {
    categories: Item[];
    stores: Item[];
    brands: Item[];
}

export const CategoriesContext = createContext<CategoriesContextData | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Item[]>([]);
    const [stores, setStores] = useState<Item[]>([]);
    const [brands, setBrands] = useState<Item[]>([]);

    const fetchCategories = async () => {
        const response = await apiClient.get("sneakers/categories");
        setCategories(response.data);
    };

    const fetchStores = async () => {
        const response = await apiClient.get("sneakers/stores");
        setStores(response.data);
    };

    const fetchBrands = async () => {
        const response = await apiClient.get("sneakers/brands");
        setBrands(response.data);
    };

    useEffect(() => {
        fetchCategories();
        fetchStores();
        fetchBrands();
    }, []);

    const contextValue: CategoriesContextData = {
        categories,
        stores,
        brands
    };

    return (
        <CategoriesContext.Provider value={contextValue}>
            {children}
        </CategoriesContext.Provider>
    );
}