import axios from "axios";
import { QueryClient } from "react-query";


const apiClient = axios.create({
    baseURL: `${import.meta.env.DEV ? "http://localhost:3001" : "https://api.snkrmagnet.com.br"}`,
});

const queryClient = new QueryClient();

export { apiClient, queryClient }